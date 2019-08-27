package uk.me.mattgill.payara.tools.commands;

import java.io.File;
import java.io.IOException;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.eclipse.aether.resolution.ArtifactResolutionException;
import org.eclipse.aether.resolution.ArtifactResult;
import org.eclipse.aether.transfer.ArtifactNotFoundException;

import picocli.CommandLine.Command;
import picocli.CommandLine.Parameters;
import uk.me.mattgill.payara.tools.install.Package;
import uk.me.mattgill.payara.tools.install.Packages;
import uk.me.mattgill.payara.tools.maven.ArtifactResolver;

@Command(name = "install", description = "Installs a Payara version.")
public class Install extends CustomCommand {

    @Inject
    private Packages packages;

    @Inject
    private ArtifactResolver resolver;

    @Parameters(paramLabel = "artifact", description = "The artifact to resolve. Can either be a Payara version, maven coordinates or the path to a ZIP file.")
    private String artifact;

    @Override
    public void run() {
        File artifactFile = new File(artifact);
        try {
            Package pkg;
            // If the artifact is a maven artifact
            if (!artifactFile.exists() && !artifactFile.isFile()) {
                ArtifactResult result = resolver.resolveArtifact(artifact);
                pkg = packages.install(result.getArtifact().getFile(), artifact);
            } else {
                if (!artifactFile.isFile()) {
                    throw new IllegalArgumentException("Artifact is not a valid file.");
                }
                if (!artifactFile.canRead()) {
                    throw new IllegalArgumentException("Artifact does not have read permissions.");
                }
                pkg = packages.install(artifactFile);
            }
            if (pkg == null) {
                logger.info("Failed to install package.");
            } else {
                logger.info("Installed " + artifactFile.getAbsolutePath() + " as " + pkg.getName());
            }
        } catch (ArtifactResolutionException | ArtifactNotFoundException | IllegalArgumentException | IllegalStateException | IOException ex) {
            logger.warning(ex.getMessage());
        }
    }

}