<template>
<div>
  <header>
  <h1>Net-Work</h1>
  <p>Overview of captured network data</p>
  </header>
  <div class="intro">
    <p>uitleg project</p>
  </div>
  <h3>Captured data overview</h3>      
    <div v-for="list in stats" :key="list" class="card grey lighten-1">
      <span class="card-title">{{list.name}}</span>
      <div style="display:grid; grid-auto-flow:column;">
        <ul>
          TO
          <li v-for="item in list.to" :key=" item">{{item.ip}} : {{item.data}}</li>
        </ul>
        <ul>
          FROM
          <li v-for="item in list.from" :key=" item">{{item.ip}} : {{item.data}}</li>
        </ul>
      </div>
    </div>

<!--
      <div style="display:flex;">
        <div v-for="list in stats" :key="list" style="display:block;">
          {{list.name}}
          <ul>
            to
            <li v-for="item in list.to" :key=" item">{{item.ip}} : {{item.data}}</li>
          </ul>
          <ul>
            from
            <li v-for="item in list.from" :key=" item">{{item.ip}} : {{item.data}}</li>
          </ul>
        </div>
      </div>
-->
      
    <footer class="footer">
      <p>
      <strong>Net-work</strong> by Dimi Catrysse, Emiel Coucke, Seppe De Witte, Sirine Rajhi - Project Week 2021
      </p>
    </footer>
</div>
</template>

<script>
export default {
  name: 'App',
  data(){
      return {
        stats: undefined,
        ws: new WebSocket(`ws://${window.location.hostname}:4000`)
      }
  },
  mounted() {
    this.ws.addEventListener('message', message => {
      const data = JSON.parse(message.data)
      if(data.stats) {
        this.stats = data.stats
      }
      console.log(data)
    })
    this.askstats(5)

  },
  methods: {
    askstats(amount) {
      this.sendWSData({stats: amount})
    },
    sendWSData(data) {
      if(this.ws.readyState === 1) {
        this.ws.send(JSON.stringify(data))
      } else {
        const retryInterval = setInterval( () => {
          if(this.ws.readyState)
          {
            this.ws.send(JSON.stringify(data))
            clearInterval(retryInterval)
          }
        }, 100)
      }
    }
  }

}
</script>

<style>
* {
  background-color: rgba(248, 248, 248, 0.959);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 20px;
}

header {
  color: #F50109;
  text-align: center;
}

header p {
  font-style: italic;
}

h3 {
  color: rgb(169, 169, 169);
  text-align: center;
  font: 12;
}
.card-title {
  text-decoration: none;
  font-weight: bolder;
    background-color: rgb(169, 169, 169) ;
color: white;
}
/*
.card {
  background-color: rgb(169, 169, 169) ;
}

.card ul {
  background-color: rgb(169, 169, 169) ;
}

.card ul li {
  background-color: rgb(169, 169, 169) ;
}
*/

footer {
  text-align: center;
  width: 100%;
  bottom: 0px;
  
}

</style>
