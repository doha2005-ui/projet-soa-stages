package ma.inpt.soa.service4candidaturesrest.model;

import java.io.Serializable;

public class ApiError implements Serializable {
    private static final long serialVersionUID = 1L;

    private int code;
    private String message;

    public ApiError() {
    }

    public ApiError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
