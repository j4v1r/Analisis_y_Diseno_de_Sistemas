package API;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet(name = "MostrarDiagrama", urlPatterns = {"/MostrarDiagrama"})
public class MostrarDiagrama extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        PrintWriter out = response.getWriter();

        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            out.print("{\"status\":\"no\",\"mensaje\":\"Falta el parámetro id\"}");
            return;
        }

        try {
            int idDiagrama = Integer.parseInt(idParam);

            DB bd = new DB();
            bd.setConnection(
                "com.mysql.cj.jdbc.Driver",
                "jdbc:mysql://localhost:3306/ads_proyecto?serverTimezone=UTC"
            );

            // ── 1. Datos del diagrama ─────────────────────────────────────
            PreparedStatement psDiag = bd.getConnection().prepareStatement(
                "SELECT id_diagrama, nombre FROM diagrama WHERE id_diagrama = ?"
            );
            psDiag.setInt(1, idDiagrama);
            ResultSet rsDiag = psDiag.executeQuery();

            if (!rsDiag.next()) {
                out.print("{\"status\":\"no\",\"mensaje\":\"Diagrama no encontrado\"}");
                bd.closeConnection();
                return;
            }

            JSONObject resultado = new JSONObject();
            resultado.put("id", rsDiag.getInt("id_diagrama"));
            resultado.put("nombre", rsDiag.getString("nombre"));
            rsDiag.close();
            psDiag.close();

            // ── 2. Nodos del diagrama ─────────────────────────────────────
            PreparedStatement psNodos = bd.getConnection().prepareStatement(
                "SELECT n.idnodo, n.id_tipo, t.nombre AS tipo_nombre, n.texto, n.pos_x, n.pos_y " +
                "FROM nodo n " +
                "JOIN tipo_componente t ON n.id_tipo = t.id_tipo " +
                "WHERE n.id_diagrama = ? " +
                "ORDER BY n.idnodo"
            );
            psNodos.setInt(1, idDiagrama);
            ResultSet rsNodos = psNodos.executeQuery();

            JSONArray nodos = new JSONArray();
            while (rsNodos.next()) {
                JSONObject nodo = new JSONObject();
                nodo.put("idnodo",     rsNodos.getInt("idnodo"));
                nodo.put("id_tipo",    rsNodos.getInt("id_tipo"));
                nodo.put("tipo_nombre",rsNodos.getString("tipo_nombre"));
                nodo.put("texto",      rsNodos.getString("texto"));
                nodo.put("pos_x",      rsNodos.getInt("pos_x"));
                nodo.put("pos_y",      rsNodos.getInt("pos_y"));
                nodos.put(nodo);
            }
            rsNodos.close();
            psNodos.close();
            resultado.put("nodos", nodos);

            // ── 3. Conexiones del diagrama ────────────────────────────────
            PreparedStatement psConex = bd.getConnection().prepareStatement(
                "SELECT c.idconexion, c.id_origen, c.id_destino, c.etiqueta " +
                "FROM conexion c " +
                "JOIN nodo n ON c.id_origen = n.idnodo " +
                "WHERE n.id_diagrama = ?"
            );
            psConex.setInt(1, idDiagrama);
            ResultSet rsConex = psConex.executeQuery();

            JSONArray conexiones = new JSONArray();
            while (rsConex.next()) {
                JSONObject con = new JSONObject();
                con.put("idconexion", rsConex.getInt("idconexion"));
                con.put("id_origen",  rsConex.getInt("id_origen"));
                con.put("id_destino", rsConex.getInt("id_destino"));
                String etiqueta = rsConex.getString("etiqueta");
                con.put("etiqueta", etiqueta != null ? etiqueta : "");
                conexiones.put(con);
            }
            rsConex.close();
            psConex.close();
            resultado.put("conexiones", conexiones);

            bd.closeConnection();
            out.print(resultado.toString());

        } catch (NumberFormatException e) {
            out.print("{\"status\":\"no\",\"mensaje\":\"ID inválido\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"status\":\"no\",\"mensaje\":\"" + e.getMessage() + "\"}");
        }
    }
}