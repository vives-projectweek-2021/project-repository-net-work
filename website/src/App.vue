<template>
<div>
  <header>
  <h1>Net-Work</h1>
  <p>Overview of captured network data</p>
  </header>
      {{stats}}
      <br/>
      <br/>
      {{top10_blacklist_from}}
      <br/>
      <br/>
      {{top10_whitelist_from}}
      <br/>
      <br/>
      {{top10_grey_from}}
      <br/>
      <br/>
      <br/>
      <br/>
      {{top10_blacklist_to}}
      <br/>
      <br/>
      {{top10_whitelist_to}}
      <br/>
      <br/>
      {{top10_grey_to }}
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      {{top10_grey_to }}

  
    <footer class="footer">
      <p>
      <strong>Net-work</strong> by Dimi Catrysse, Emiel Coucke, Seppe De Witte, Sirine Rajhi - Project Week 2021
      </p>
    </footer>
</div>
</template>

<script lang='ts'>
export default {
  name: 'App',
  data(){

      return {
        stats: undefined,
        topLists: [],
        top10_blacklist_from: undefined,
        top10_whitelist_from: undefined,
        top10_grey_from: undefined,
        top10_blacklist_to: undefined,
        top10_whitelist_to: undefined,
        top10_grey_to: undefined

      }
  },
  mounted() {
    fetch(`http://${window.location.hostname}:4000/stats`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      this.stats = data


      this.top10_blacklist_from = data.find(x=>x.name==='blacklist').stats.sort((a,b)=>(b.TCP_from + b.UDP_from) - (a.TCP_from + b.UDP_from)).slice(0,10)
      this.top10_whitelist_from = data.find(x=>x.name==='whitelist').stats.sort((a,b)=>(b.TCP_from + b.UDP_from) - (a.TCP_from + b.UDP_from)).slice(0,10)
      this.top10_grey_from = data.find(x=>x.name==='unknown').stats.sort((a,b)=>(b.TCP_from + b.UDP_from) - (a.TCP_from + b.UDP_from)).slice(0,10)
      this.top10_blacklist_to = data.find(x=>x.name==='blacklist').stats.sort((a,b)=>(b.TCP_to + b.UDP_to) - (a.TCP_to + b.UDP_to)).slice(0,10)
      this.top10_whitelist_to = data.find(x=>x.name==='whitelist').stats.sort((a,b)=>(b.TCP_to + b.UDP_to) - (a.TCP_to + b.UDP_to)).slice(0,10)
      this.top10_grey_to = data.find(x=>x.name==='unknown').stats.sort((a,b)=>(b.TCP_to + b.UDP_to) - (a.TCP_to + b.UDP_to)).slice(0,10)
      console.log(this.top10_grey_to)

      data.forEach(list => {
        console.log(list)
        let items_to = []
        list.stats.sort((a,b)=>(b.TCP_from + b.UDP_from) - (a.TCP_from + b.UDP_from)).slice(0,10).forEach(item => {
          items_to.push({ip: item.ip, data: item.TCP_from + item.UDP_from})
        });
        console.log(items_to)
        let top10 = {
          name: list.name,
          direction: 'to',
          items: items_to
        }
          console.log(top10)
        this.topLists.push(top10)
        console.log(this.topLists)
        
      });
      
    })
  }

}
</script>

<style>
* {
  background-color: rgba(245, 234, 234, 0.959);
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

table {
  align-items: center;
  margin: auto;

}

li {
  list-style-type: none;
}

table td {
border-style: solid;
}
 
h2 {
  text-decoration: underline;
}
footer {
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 0px;
  display:none;
}

</style>
