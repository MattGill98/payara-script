package uk.me.mattgill.payara.tools.util;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.atomic.AtomicBoolean;

import com.sun.enterprise.admin.servermgmt.cli.LocalServerCommand;
import com.sun.enterprise.universal.process.ProcessUtils;
import com.sun.enterprise.util.io.ServerDirs;

import org.glassfish.api.admin.CommandException;

public final class PayaraUtils {

    private PayaraUtils() {
    }

    public static boolean killDomain() {
        try {
            if (ProcessUtils.killJvm("ASMain") != null) {
                return false;
            }
        } catch (Exception ex) {
            return false;
        }
        return true;
    }

    public static boolean isDomainRunning(File domainDir) {
        AtomicBoolean running = new AtomicBoolean();
        try {
            new LocalServerCommand() {

                @Override
                protected int executeCommand() throws CommandException {
                    running.set(isRunning());
                    return 0;
                }

                @Override
                public int execute(String... argv) throws CommandException {
                    try {
                        setServerDirs(new ServerDirs(domainDir));
                    } catch (IOException ex) {
                        setServerDirs(new ServerDirs());
                    }
                    return executeCommand();
                }

            }.execute();
        } catch (CommandException e) {
            e.printStackTrace();
        }
        return running.get();
    }
}