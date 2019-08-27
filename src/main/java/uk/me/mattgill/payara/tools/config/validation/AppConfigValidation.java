package uk.me.mattgill.payara.tools.config.validation;

import java.io.File;

public final class AppConfigValidation {

    private AppConfigValidation() {
    }

    public static final void validatePackagesDirectory(File installDir) throws ValidationException {
        if (installDir == null) {
            throw new ValidationException("Install directory cannot be null.");
        }
        if (!installDir.exists()) {
            if (!installDir.getParentFile().exists()) {
                throw new ValidationException("Payara install directory can't be found.");
            }
            if (!installDir.getParentFile().canWrite()) {
                throw new ValidationException("Cannot write to Payara install directory parent.");
            }
            try {
                installDir.mkdir();
                return;
            } catch (SecurityException ex) {
                throw new ValidationException("Payara install directory can't be created.");
            }
        }
        if (!installDir.isDirectory()) {
            throw new ValidationException("Payara install directory cannot override existing file.");
        }
        if (!installDir.canWrite()) {
            throw new ValidationException("Cannot write to Payara install directory.");
        }
    }

}