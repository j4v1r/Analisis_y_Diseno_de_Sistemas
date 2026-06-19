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
public class MostrarDiagramas extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)throws IOException{
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        
        JSONArray arreglo = new JSONArray();
        
        try {
            DB bd = new DB();
            bd.setConnection(
                    "com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost:3306/ads_proyecto?serverTimezone=UTC"
            );

            PreparedStatement ps = bd.getConnection().prepareStatement(
                    "SELECT id_diagrama, nombre FROM diagrama WHERE idusuario=1"
            );

            ResultSet rs = ps.executeQuery();

            while(rs.next()){
                
                JSONObject obj = new JSONObject();
                obj.put("id",rs.getInt("id_diagrama"));
                obj.put("nombre",rs.getString("nombre"));
                arreglo.put(obj);
            }
            
            response.getWriter().print(arreglo.toString());
            
            rs.close();
            bd.closeConnection();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
                
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}
