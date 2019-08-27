package uk.me.mattgill.payara.tools.config;

import static java.util.stream.Collectors.joining;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

public abstract class FileConfig implements AutoCloseable {

    private static final Logger LOGGER = Logger.getLogger(FileConfig.class.getName());

    private final File file;
    protected final Properties properties;

    protected FileConfig(File file) throws IOException {
        this.file = file;
        this.properties = new Properties();
        try (FileInputStream inputStream = new FileInputStream(file)) {
            properties.load(inputStream);
        } catch (FileNotFoundException ex) {
            LOGGER.fine("Could not find properties file. This file will be created when a property is set.");
        }
    }

    protected String get(String propertyName) {
        return properties.getProperty(propertyName);
    }

    protected String setIfAbsent(String propertyName, String defaultValue) {
        String value = get(propertyName);
        if (value == null) {
            value = defaultValue;
            set(propertyName, value);
        }
        return value;
    }

    protected void set(String propertyName, String propertyValue) {
        properties.setProperty(propertyName, propertyValue);
    }

    public String print(String propertyName) {
        return propertyName + " = " + get(propertyName);
    }

    public String printAll() {
        return properties.keySet().stream()
                .map(prop -> print(prop.toString()))
                .collect(joining("\n"));
    }

    @Override
    public String toString() {
        return printAll();
    }

    @Override
    public void close() throws Exception {
        try (FileOutputStream outputStream = new FileOutputStream(file)) {
            properties.store(outputStream, "");
        } catch (FileNotFoundException ex) {
            LOGGER.fine("Could not open the properties file. Make sure the file is accessible.");
        }
    }
}