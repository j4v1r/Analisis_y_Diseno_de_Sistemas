package API;

import java.io.*;
import java.sql.PreparedStatement;
import java.util.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

@WebServlet(name = "SubirArchivo", urlPatterns = {"/SubirArchivo"})
public class SubirArchivo extends HttpServlet {

        private static final long MAX_FILE_SIZE = 200L * 1024 * 1024; // 200 MB
        private static final int  MAX_MEM_SIZE  = 4    * 1024 * 1024; // 4 MB en memoria

    private static final List<String> EXTENSIONES_VALIDAS = Arrays.asList(
        "jpg","jpeg","png","gif","bmp",
        "mp3","wav","ogg",
        "mp4","avi","mov","webm"
    );

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        PrintWriter out = response.getWriter();

        if (!ServletFileUpload.isMultipartContent(request)) {
            out.print("{\"status\":\"no\",\"mensaje\":\"La peticion no es multipart\"}");
            return;
        }

        try {
            String uploadPath = request.getRealPath("/") + "archivos" + File.separator;
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            DiskFileItemFactory factory = new DiskFileItemFactory();
            factory.setSizeThreshold(MAX_MEM_SIZE);
            factory.setRepository(new File(System.getProperty("java.io.tmpdir")));

            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setSizeMax(MAX_FILE_SIZE);

            List<FileItem> items = upload.parseRequest(request);

            String nombreArchivo = null;
            int idDiagrama = 0;

            for (FileItem item : items) {
                if (item.isFormField()) {
                    if ("id_diagrama".equals(item.getFieldName())) {
                        idDiagrama = Integer.parseInt(item.getString());
                    }
                } else {
                    String nombreOriginal = item.getName();
                    if (nombreOriginal == null || nombreOriginal.isEmpty()) continue;

                    if (nombreOriginal.lastIndexOf("\\") >= 0)
                        nombreOriginal = nombreOriginal.substring(nombreOriginal.lastIndexOf("\\") + 1);

                    String ext = "";
                    int punto = nombreOriginal.lastIndexOf(".");
                    if (punto >= 0) ext = nombreOriginal.substring(punto + 1).toLowerCase();

                    if (!EXTENSIONES_VALIDAS.contains(ext)) {
                        out.print("{\"status\":\"no\",\"mensaje\":\"Tipo de archivo no permitido: " + ext + "\"}");
                        return;
                    }

                    nombreArchivo = "diagrama_" + idDiagrama + "_" + System.currentTimeMillis() + "." + ext;
                    File archivoDestino = new File(uploadPath + nombreArchivo);
                    item.write(archivoDestino);
                }
            }

            if (nombreArchivo != null && idDiagrama > 0) {
                String urlArchivo = "http://localhost:8080/backend/archivos/" + nombreArchivo;

                // ── Guardar URL en la tabla diagrama ──────────────────────
                DB bd = new DB();
                bd.setConnection(
                    "com.mysql.cj.jdbc.Driver",
                    "jdbc:mysql://localhost:3306/ads_proyecto?serverTimezone=UTC"
                );
                PreparedStatement ps = bd.getConnection().prepareStatement(
                    "UPDATE diagrama SET url_archivo=? WHERE id_diagrama=?"
                );
                ps.setString(1, urlArchivo);
                ps.setInt(2, idDiagrama);
                ps.executeUpdate();
                ps.close();
                bd.closeConnection();

                out.print("{\"status\":\"yes\",\"url\":\"" + urlArchivo + "\"}");
            } else {
                out.print("{\"status\":\"no\",\"mensaje\":\"No se recibio el archivo o el id del diagrama\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"status\":\"no\",\"mensaje\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}