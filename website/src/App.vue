<template>
<div>
  <header>
  <h1>Net-Work</h1>
  <p>Overview of captured network data</p>
  </header>
  <h3>Bandwidth in use:</h3>
  <k-progress
    bg-color="rgb(169, 169, 169)"
    lineHeight="10"
    :percent="bandwidth"
    :color="percentColor"
  />

  <h3>Captured data overview</h3>    

  <div class="columnGrid gridGap20"> 
    <div v-for="list in stats" :key="list" class="card grey lighten-1">
      <span class="card-title" style="margin: 20px;">{{list.name}}</span>
      <div class="columnGrid gridGap20 grey lighten-2">
          <ul class="collection with-header" v-for="direction in ['to','from']" :key="direction">
            <li class="collection-header grey lighten-2 center"><h6>{{direction.toUpperCase()}}</h6></li>
            <li class="collection-item grey lighten-3" v-for="item in list[direction]" :key=" item">
              <strong class="title">{{item.data}}</strong>
              <span class="title right">{{item.ip}}</span>
              <span v-if="item.filterNames.length !== 0" style="display:block;">
                [{{item.filterNames.join(' | ')}}]
              </span>
              <span v-else style="display:block;">&nbsp;</span>
            </li>
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
        console.log(data.stats)
        this.stats = data.stats
      }
      else if(data.bandwidth)
      {
        let bandwidth = data.bandwidth
        bandwidth = bandwidth<0?0:bandwidth
        bandwidth = bandwidth>100?100:bandwidth
        this.bandwidth = bandwidth
      }
      console.log(data)
    })
    //this.askstats(5)

  },
  methods: {
    percentColor(percent) {
      if(percent<33) {
        return "#9ECBA7"
      }
      else if (percent > 66) {
        return "#E7465E"
      }
      else {
        return "#F5DA3F"
      }
    },
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
}

.columnGrid {
  display: grid;
  grid-auto-flow: column; 
}
.gridGap20 {
  grid-gap: 20px;
}

footer {
  text-align: center;
  width: 100%;
  bottom: 0px;
  
}

</style>
