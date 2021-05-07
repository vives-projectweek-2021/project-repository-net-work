<template>
<div>
  <header>
  <h1>Net-Work</h1>
  <p>Overview of captured network data</p>
  </header>
  <div class="intro">
    <p>uitleg project</p>
  </div>
  <h3>Bandwidth in use:</h3>
  <k-progress :percent="bandwidth" color="#f5da3f"/>

  <h3>Captured data overview</h3>      
    <div v-for="list in stats" :key="list" class="card grey lighten-1">
      <span class="card-title" style="margin: 20px;">{{list.name}}</span>
      <div style="display:grid; grid-auto-flow:column;" class="grey lighten-2">
        <div class="center">
          TO
        <ul>
          <li v-for="item in list.to" :key=" item">{{item.ip}} : {{item.data}}</li>
        </ul>
        </div>
        <div class="center">
          FROM
        <ul>
          <li v-for="item in list.from" :key=" item">{{item.ip}} : {{item.data}}</li>
        </ul>
        </div>
      </div>
    </div>
     
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
        ws: new WebSocket(`ws://${window.location.hostname}:4000`),
        bandwidth: 0
      }
  },
  mounted() {
    this.ws.addEventListener('message', message => {
      const data = JSON.parse(message.data)
      if(data.stats) {
        this.stats = data.stats
      }
      else if(data.bandwidth)
      {
        let bandwidth = data.bandwidth
        bandwidth<0?0:bandwidth
        bandwidth>100?100:bandwidth
        this.bandwidth = bandwidth
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #eceff1;
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
/*
.card-title {
  text-decoration: none;
  font-weight: bolder;
    background-color: rgb(169, 169, 169) ;
color: white;
}

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
