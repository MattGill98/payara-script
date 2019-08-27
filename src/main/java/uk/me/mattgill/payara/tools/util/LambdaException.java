package uk.me.mattgill.payara.tools.util;

public class LambdaException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public LambdaException(Exception cause) {
        super(cause);
    }

    @Override
    public String toString() {
        return getCause().toString();
    }
}