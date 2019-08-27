package uk.me.mattgill.payara.tools.maven;

import java.io.File;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.eclipse.aether.resolution.ArtifactResolutionException;
import org.eclipse.aether.resolution.ArtifactResult;
import org.eclipse.aether.transfer.ArtifactNotFoundException;

import uk.me.mattgill.payara.tools.config.AppConfig;

public class ArtifactResolver {

    private static final Logger LOGGER = Logger.getLogger(ArtifactResolver.class.getName());

    private static String GROUP_ID = "fish.payara.distributions";
    private static String ARTIFACT_ID = "payara";
    private static String PACKAGING = "zip";

    private final RepositoryManager repositoryManager;

    public ArtifactResolver(String username, String password) {
        if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
            LOGGER.info("Nexus username or password is not configured. It will not be possible to download from Nexus without these.");
        }
        RepositoryManager repositoryManager = new RepositoryManager();
        repositoryManager.setLocalRepository(new File(System.getProperty("user.home"), ".m2/repository"));
        repositoryManager.addRemoteRepository("central", "https://repo.maven.apache.org/maven2/");
        repositoryManager.addRemoteRepository("payara-staging", "https://nexus.payara.fish/content/repositories/payara-staging/", username, password);
        repositoryManager.addRemoteRepository("payara-patches", "https://nexus.payara.fish/content/repositories/payara-patches/", username, password);
        this.repositoryManager = repositoryManager;
    }

    @Inject
    protected ArtifactResolver(AppConfig config) {
        this(config.getNexusUsername(), config.getNexusPassword());
    }

    public ArtifactResult resolveArtifact(String artifactName) throws ArtifactResolutionException, ArtifactNotFoundException {
        String[] artifactParts = artifactName.split(":");
        String groupId = GROUP_ID;
        String artifactId = ARTIFACT_ID;
        String version = null;
        String classifier = null;
        String packaging = PACKAGING;
        switch (artifactParts.length) {
        case 3:
            classifier = artifactParts[2];
        case 2:
            String part = artifactParts[1];

            // Handle blue distribution special case
            if (part.startsWith("blue-")) {
                part = part.replace("blue-", "");
                groupId = groupId.replace("fish.payara", "fish.payara.blue");
            }
            // Handle micro distribution special case
            if (part.equals("micro")) {
                groupId = groupId.replace("distributions", "extras");
                packaging = "jar";
            }

            artifactId = ARTIFACT_ID + "-" + artifactParts[1];
        case 1:
            version = artifactParts[0];
        }
        return resolveArtifact(groupId, artifactId, version, classifier, packaging);
    }

    private ArtifactResult resolveArtifact(String groupId, String artifactId, String version, String classifier, String packaging)
            throws ArtifactResolutionException, ArtifactNotFoundException {
        return repositoryManager.resolveArtifact(groupId, artifactId, version, classifier, packaging);
    }
}