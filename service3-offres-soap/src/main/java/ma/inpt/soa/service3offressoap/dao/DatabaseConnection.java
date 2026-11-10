package ma.inpt.soa.service3offressoap.dao;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConnection {
    private static String url = "jdbc:mysql://localhost:3306/soa_stages?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static String user = "root";
    private static String password = "CHANGER_MOI";

    static {
        try {
            Properties props = new Properties();
            InputStream input = DatabaseConnection.class.getClassLoader().getResourceAsStream("db.properties");
            if (input != null) {
                props.load(input);
                if (props.getProperty("db.url") != null && !props.getProperty("db.url").trim().isEmpty()) {
                    url = props.getProperty("db.url");
                }
                if (props.getProperty("db.user") != null && !props.getProperty("db.user").trim().isEmpty()) {
                    user = props.getProperty("db.user");
                }
                if (props.getProperty("db.password") != null) {
                    password = props.getProperty("db.password");
                }
            }
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (Exception e) {
            System.err.println("[Service 3 Offre] Initialisation DatabaseConnection: " + e.getMessage());
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }
}
