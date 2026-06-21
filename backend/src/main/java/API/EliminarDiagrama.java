package API;

import java.io.IOException;
import java.io.PrintWriter;
import static java.lang.System.out;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author aleja
 */
public class EliminarDiagrama extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        JSONArray arreglo = new JSONArray();

        try ( PrintWriter out = response.getWriter()) {

            DB bd = new DB();
            bd.setConnection(
                    "com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost:3306/ads_proyecto?serverTimezone=UTC"
            );

            int id_diagrama = Integer.parseInt(request.getParameter("id"));

            PreparedStatement ps = bd.getConnection().prepareStatement(
                    "DELETE FROM diagrama WHERE id_diagrama=?"
            );

            ps.setInt(1, id_diagrama);

            int filas = ps.executeUpdate();

            if (filas > 0) {
                out.print("{\"status\":\"yes\"}");
            } else {
                out.print("{\"status\":\"no\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doOptions(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
