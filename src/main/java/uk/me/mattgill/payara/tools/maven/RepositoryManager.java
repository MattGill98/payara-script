package uk.me.mattgill.payara.tools.maven;

import java.io.File;
import java.util.ArrayList;

import org.apache.maven.repository.internal.MavenRepositorySystemUtils;
import org.eclipse.aether.DefaultRepositorySystemSession;
import org.eclipse.aether.RepositorySystem;
import org.eclipse.aether.artifact.DefaultArtifact;
import org.eclipse.aether.connector.basic.BasicRepositoryConnectorFactory;
import org.eclipse.aether.impl.DefaultServiceLocator;
import org.eclipse.aether.repository.LocalRepository;
import org.eclipse.aether.repository.RemoteRepository;
import org.eclipse.aether.resolution.ArtifactRequest;
import org.eclipse.aether.resolution.ArtifactResolutionException;
import org.eclipse.aether.resolution.ArtifactResult;
import org.eclipse.aether.spi.connector.RepositoryConnectorFactory;
import org.eclipse.aether.spi.connector.transport.TransporterFactory;
import org.eclipse.aether.transfer.ArtifactNotFoundException;
import org.eclipse.aether.transport.file.FileTransporterFactory;
import org.eclipse.aether.transport.http.HttpTransporterFactory;
import org.eclipse.aether.util.repository.AuthenticationBuilder;

class RepositoryManager {

    private final RepositorySystem system;
    private final DefaultRepositorySystemSession session;

    private final ArtifactRequest request;

    protected RepositoryManager() {
        DefaultServiceLocator locator = MavenRepositorySystemUtils.newServiceLocator();
        locator.addService(RepositoryConnectorFactory.class, BasicRepositoryConnectorFactory.class);
        locator.addService(TransporterFactory.class, FileTransporterFactory.class);
        locator.addService(TransporterFactory.class, HttpTransporterFactory.class);

        this.system = locator.getService(RepositorySystem.class);

        this.session = MavenRepositorySystemUtils.newSession();
        session.setTransferListener(new ConsoleTransferListener());
        session.setRepositoryListener(new ConsoleRepositoryListener());
        request = new ArtifactRequest();
        request.setRepositories(new ArrayList<>());
    }

    public void setLocalRepository(File mavenRepo) {
        LocalRepository local = new LocalRepository(mavenRepo.getAbsolutePath());
        session.setLocalRepositoryManager(system.newLocalRepositoryManager(session, local));
    }

    public void addRemoteRepository(String id, String url) {
        addRemoteRepository(id, url, null, null);
    }

    public void addRemoteRepository(String id, String url, String username, String password) {
        RemoteRepository.Builder builder = new RemoteRepository.Builder(id, "default", url);
        if (username != null && password != null) {
            builder.setAuthentication(new AuthenticationBuilder().addUsername(username).addPassword(password).build());
        }
        request.getRepositories().add(builder.build());
    }

    public ArtifactResult resolveArtifact(String groupId, String artifactId, String version, String classifier,
            String packaging) throws ArtifactResolutionException, ArtifactNotFoundException {
        request.setArtifact(new DefaultArtifact(groupId, artifactId, classifier, packaging, version));
        return system.resolveArtifact(session, request);
    }
}