<template>
    <div>
      <q-toolbar class="bg-secondary">
          <q-toolbar-title @click="navigateTo('/')">            
            DB Rendimiento
          </q-toolbar-title>
          <q-tabs inline-label
        class="text-white shadow-2" align="justify" >
        <!--
        <q-tab @click="navigateTo('/mysql')" label="Mysql" class="text-capitalize" />
        -->
        <q-btn-dropdown color="secondary text-black" label="Gestores Relacionales">
          <q-list>
            <q-item clickable v-close-popup @click="navigateTo('/mysql')" >
              <q-item-section>
                <q-item-label>MySQL</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="navigateTo('/mariadb')" >
              <q-item-section>
                <q-item-label>Maria DB</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="navigateTo('/posgresql')">
              <q-item-section>
                <q-item-label>PostgreSQL</q-item-label>
              </q-item-section>
            </q-item>
            
          </q-list>
          <q-item clickable v-close-popup @click="navigateTo('/sqlserver')">
              <q-item-section>
                <q-item-label>SQL Server</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="navigateTo('/oracle')">
              <q-item-section>
                <q-item-label>Oracle Database</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="navigateTo('/firebird')">
              <q-item-section>
                <q-item-label>FireBird</q-item-label>
              </q-item-section>
            </q-item>
        </q-btn-dropdown>
        
        <q-btn-dropdown color="secondary text-black" label="Gestores NO Relacionales (No SQL)">
          <q-list>
            <q-item clickable v-close-popup @click="navigateTo('/mongodb')">
              <q-item-section>
                <q-item-label>MongoDB</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="navigateTo('/cassandra')" >
              <q-item-section>
                <q-item-label>Cassandra</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="navigateTo('/couchdb')">
              <q-item-section>
                <q-item-label>CouchDB</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="navigateTo('/rethinkdb')">
              <q-item-section>
                <q-item-label>RethinkDB</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-item clickable v-close-popup @click="navigateTo('/scylladb')">
              <q-item-section>
                <q-item-label>ScyllaDB</q-item-label>
              </q-item-section>
            </q-item>
            <!-- <q-item clickable v-close-popup @click="navigateTo('/dynamodb')">
              <q-item-section>
                <q-item-label>DynamoDB</q-item-label>
              </q-item-section>
            </q-item>        -->
        </q-btn-dropdown>
        <!--
        <q-tab @click="navigateTo('/mariadb')"  label="MariaDB" class="text-capitalize" />
        <q-tab  label="PostgreSQL" class="text-capitalize" />
        <q-tab  label="SQLite" class="text-capitalize" />
        <q-tab  label="SQL Server" class="text-capitalize" />
        <q-tab  label="FireBird" class="text-capitalize" />
        <q-tab  label="Oracle" class="text-capitalize" />
        <q-tab  label="MongoDB" class="text-capitalize" />
        <q-tab  label="Cassandra" class="text-capitalize" />
        <q-tab  label="CouchDB" class="text-capitalize" />
        <q-tab  label="RethinkDB" class="text-capitalize" />-->
      </q-tabs>
        <q-space />
    </q-toolbar>
    <slot></slot>
    </div>
    
  </template>



  
  