package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet para modificar un diagrama existente.
 * Recibe JSON por POST con la estructura:
 * {
 *   "id_diagrama": 1,
 *   "nombre": "Nuevo nombre",
 *   "idusuario": 1,
 *   "nodos": [ { "id_tipo": 1, "texto": "Inicio", "pos_x": 100, "pos_y": 50 }, ... ],
 *   "conexiones": [ { "origen_idx": 0, "destino_idx": 1, "etiqueta": "" }, ... ]
 * }
 * Estrategia: elimina nodos/conexiones anteriores y los reinserta con las nuevas posiciones.
 */
@WebServlet(name = "ModificarDiagrama", urlPatterns = {"/ModificarDiagrama"})
public class ModificarDiagrama extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        PrintWriter out = response.getWriter();

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            sb.append(line);
        }

        try {
            JSONObject body = new JSONObject(sb.toString());

            int    idDiagrama = body.getInt("id_diagrama");
            String nombre     = body.getString("nombre");
            JSONArray nodos      = body.getJSONArray("nodos");
            JSONArray conexiones = body.getJSONArray("conexiones");

            DB bd = new DB();
            bd.setConnection(
                "com.mysql.cj.jdbc.Driver",
                "jdbc:mysql://localhost:3306/ads_proyecto?serverTimezone=UTC"
            );

            // ── 1. Actualizar nombre y fecha_modificacion del diagrama ────
            Timestamp ahora = new Timestamp(System.currentTimeMillis());
            PreparedStatement psUpdate = bd.getConnection().prepareStatement(
                "UPDATE diagrama SET nombre=?, fecha_modificacion=? WHERE id_diagrama=?"
            );
            psUpdate.setString(1, nombre);
            psUpdate.setTimestamp(2, ahora);
            psUpdate.setInt(3, idDiagrama);
            psUpdate.executeUpdate();
            psUpdate.close();

            // ── 2. Eliminar nodos anteriores (las conexiones se eliminan en cascada) ──
            PreparedStatement psDelNodos = bd.getConnection().prepareStatement(
                "DELETE FROM nodo WHERE id_diagrama=?"
            );
            psDelNodos.setInt(1, idDiagrama);
            psDelNodos.executeUpdate();
            psDelNodos.close();

            // ── 3. Reinsertar nodos ───────────────────────────────────────
            int[] idsNodos = new int[nodos.length()];
            PreparedStatement psNodo = bd.getConnection().prepareStatement(
                "INSERT INTO nodo (id_diagrama, id_tipo, texto, pos_x, pos_y) VALUES (?,?,?,?,?)",
                PreparedStatement.RETURN_GENERATED_KEYS
            );

            for (int i = 0; i < nodos.length(); i++) {
                JSONObject n = nodos.getJSONObject(i);
                psNodo.setInt(1, idDiagrama);
                psNodo.setInt(2, n.getInt("id_tipo"));
                psNodo.setString(3, n.getString("texto"));
                psNodo.setInt(4, n.getInt("pos_x"));
                psNodo.setInt(5, n.getInt("pos_y"));
                psNodo.executeUpdate();

                ResultSet rsNodo = psNodo.getGeneratedKeys();
                if (rsNodo.next()) idsNodos[i] = rsNodo.getInt(1);
            }
            psNodo.close();

            // ── 4. Reinsertar conexiones ──────────────────────────────────
            PreparedStatement psConexion = bd.getConnection().prepareStatement(
                "INSERT INTO conexion (id_origen, id_destino, etiqueta) VALUES (?,?,?)"
            );

            for (int i = 0; i < conexiones.length(); i++) {
                JSONObject c = conexiones.getJSONObject(i);
                int origenIdx  = c.getInt("origen_idx");
                int destinoIdx = c.getInt("destino_idx");
                String etiqueta = c.optString("etiqueta", "");

                if (origenIdx < idsNodos.length && destinoIdx < idsNodos.length) {
                    psConexion.setInt(1, idsNodos[origenIdx]);
                    psConexion.setInt(2, idsNodos[destinoIdx]);
                    psConexion.setString(3, etiqueta);
                    psConexion.executeUpdate();
                }
            }
            psConexion.close();
            bd.closeConnection();

            out.print("{\"status\":\"yes\",\"id_diagrama\":" + idDiagrama + "}");

        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"status\":\"no\",\"mensaje\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}