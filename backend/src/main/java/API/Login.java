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

/**
 *
 * @author aleja
 */
@WebServlet(name = "Login", urlPatterns = {"/Login"})
public class Login extends HttpServlet {

    private PrintWriter outter;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        outter = response.getWriter();
        response.setContentType("text/html");

        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");

        String usuario = request.getParameter("user");
        String password = request.getParameter("password");
        PrintWriter out = response.getWriter();

        try {
            DB bd = new DB();
            bd.setConnection(
                    "com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost/usuario?serverTimezone=UTC"
            );

            PreparedStatement ps = bd.getConnection().prepareStatement(
                    "SELECT * FROM usuario WHERE usuario=? AND password=?"
            );

            ps.setString(1, usuario);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if(rs.next()){
                out.println(
                        "{\"status\":\"yes\",\"tipo\":\""
                        + rs.getString("tipo_usuario")
                        + "\"}"
                );
            }else{
                out.println("{\"status\":\"no\",\"tipo\":\"nodefinido\"}");
            }
            
            rs.close();
            ps.close();
            bd.closeConnection();
            
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
