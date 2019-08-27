package uk.me.mattgill.payara.tools.commands;

import java.io.File;

import javax.inject.Inject;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;
import uk.me.mattgill.payara.tools.config.AppConfig;
import uk.me.mattgill.payara.tools.config.validation.ValidationException;
import uk.me.mattgill.payara.tools.install.Package;

@Command(name = "set", description = "Configures the tool.")
public class Set extends CustomCommand {

    @Inject
    private AppConfig config;

    @Option(names = "rootdir", description = "The installation directory for Payara instances.")
    private String installDir;

    @Option(names = "username", description = "The username for connecting to nexus repositories.")
    private String nexusUsername;

    @Option(names = "password", description = "The password for connecting to nexus repositories.", interactive = true)
    private String nexusPassword;

    @Parameters(paramLabel = "version", description = "The version of the domain to start.", defaultValue = "")
    private String version;

    @Override
    public void run() {
        boolean configured = false;
        if (installDir != null) {
            try {
                config.setPackagesDirectory(new File(installDir));
            } catch (ValidationException ex) {
                logger.warning(ex.getMessage());
            }
            configured = true;
        }
        if (nexusUsername != null) {
            config.setNexusUsername(nexusUsername);
            configured = true;
        }
        if (nexusPassword != null) {
            config.setNexusPassword(nexusPassword);
            configured = true;
        }
        if (version != null && !version.isEmpty()) {
            Package pkg = new Package(new File(config.getPackagesDirectory(), version), false);
            if (pkg.isValid()) {
                config.setActivePackage(version);
            } else {
                logger.warning("Invalid package.");
            }
            configured = true;
        }
        if (!configured) {
            help.prompt();
        }
    }

}