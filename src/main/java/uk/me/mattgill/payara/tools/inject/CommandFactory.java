package uk.me.mattgill.payara.tools.inject;

import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Provides;

import picocli.CommandLine.IFactory;
import uk.me.mattgill.payara.tools.config.AppConfig;
import uk.me.mattgill.payara.tools.install.Package;
import uk.me.mattgill.payara.tools.install.Packages;

public class CommandFactory implements IFactory {

    private final Injector injector;

    public CommandFactory(AppConfig config) {
        Packages packages = new Packages(config.getPackagesDirectory(), config.getActivePackage());
        this.injector = Guice.createInjector(new AbstractModule() {
            @Provides Packages getPackages() { return packages; }
            @Provides Package getActivePackage() { return packages.getActivePackage(); }
            @Provides AppConfig getConfig() { return config; }
        });
    }

    @Override
    public <K> K create(Class<K> cls) throws Exception {
        return injector.getInstance(cls);
    }

}