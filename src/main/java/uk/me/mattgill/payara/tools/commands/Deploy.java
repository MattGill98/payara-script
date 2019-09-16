package uk.me.mattgill.payara.tools.commands;

import java.io.File;
import java.util.logging.Logger;

import javax.inject.Inject;

import picocli.CommandLine.Command;
import picocli.CommandLine.Parameters;

@Command(name = "deploy", description = "Deploys an application to the running Payara package.")
public class Deploy extends Asadmin {

    @Parameters(paramLabel = "artifact", description = "The artifact to deploy.", defaultValue = "")
    private String artifact;

    @Inject
    private Logger logger;

    @Override
    public void runCommand() {
        File artifactFile = new File(artifact);
        if (artifact.isEmpty() || !artifactFile.exists()) {
            logger.warning("Selected artifact must exist.");
            return;
        }
        if (!artifactFile.canRead()) {
            logger.warning("No read permissions to selected artifact.");
            return;
        }
        asadmin("deploy", "--contextroot", "/", "--force", artifact);
    }

}