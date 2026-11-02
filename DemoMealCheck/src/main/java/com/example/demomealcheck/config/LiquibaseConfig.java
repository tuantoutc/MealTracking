package com.example.demomealcheck.config;

import jakarta.persistence.EntityManagerFactory;
import liquibase.integration.spring.SpringLiquibase;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class LiquibaseConfig {

    @Bean
    public SpringLiquibase liquibase(DataSource dataSource) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(dataSource);
        liquibase.setChangeLog("classpath:db/changelog/db.changelog-master.xml");
        liquibase.setContexts("development,test,production");
        liquibase.setShouldRun(true);
        return liquibase;
    }

    @Bean
    public static BeanFactoryPostProcessor liquibaseEntityManagerFactoryDependsOnPostProcessor() {
        return beanFactory -> {
            for (String name : beanFactory.getBeanNamesForType(EntityManagerFactory.class, true, false)) {
                BeanDefinition bd = beanFactory.getBeanDefinition(name);
                String[] dependsOn = bd.getDependsOn();
                if (dependsOn == null || dependsOn.length == 0) {
                    bd.setDependsOn("liquibase");
                } else {
                    String[] newDependsOn = new String[dependsOn.length + 1];
                    System.arraycopy(dependsOn, 0, newDependsOn, 0, dependsOn.length);
                    newDependsOn[dependsOn.length] = "liquibase";
                    bd.setDependsOn(newDependsOn);
                }
            }
        };
    }
}
