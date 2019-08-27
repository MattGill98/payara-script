package uk.me.mattgill.payara.tools.maven;

import java.io.PrintStream;

import org.eclipse.aether.AbstractRepositoryListener;
import org.eclipse.aether.RepositoryEvent;

class ConsoleRepositoryListener extends AbstractRepositoryListener {

    private PrintStream out;

    protected ConsoleRepositoryListener() {
        this.out = System.out;
    }

    @Override
    public void artifactDescriptorInvalid(RepositoryEvent event) {
        out.println(
                "Invalid artifact descriptor for " + event.getArtifact() + ": " + event.getException().getMessage());
    }

    @Override
    public void artifactDescriptorMissing(RepositoryEvent event) {
        out.println("Missing artifact descriptor for " + event.getArtifact());
    }

    @Override
    public void artifactInstalled(RepositoryEvent event) {
        out.println("Installed " + event.getArtifact() + " to " + event.getFile());
    }

    @Override
    public void artifactInstalling(RepositoryEvent event) {
        out.println("Installing " + event.getArtifact() + " to " + event.getFile());
    }

    @Override
    public void artifactResolved(RepositoryEvent event) {
        if (event.getRepository() != null) {
            out.println("Resolved artifact " + event.getArtifact() + " from " + event.getRepository().getId());
        }
    }

    @Override
    public void artifactDownloading(RepositoryEvent event) {
        if (event.getRepository() != null) {
            out.println("Downloading artifact " + event.getArtifact() + " from " + event.getRepository().getId());
        }
    }

    @Override
    public void artifactResolving(RepositoryEvent event) {
        out.println("Resolving artifact " + event.getArtifact());
    }

}