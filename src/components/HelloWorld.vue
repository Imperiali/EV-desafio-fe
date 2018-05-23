<template>
  <div>
    <h1>Ache o endereço com o CEP!</h1>
    <label>Cep</label><input type="number" v-model="cep"/><button @click="getAdress(cep)">Enviar</button>
    <label>Numero:</label><input type="number" v-model="numero"/>
    <label>Completemento:</label><input type="text" v-model="complemento"/>
    {{logradouro}} {{bairro}} {{localidade}}
    {{numero}} {{complemento}}
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  data () {
    return {
      cep: '',
      logradouro:'',
      complemento:'',
      bairro:'',
      localidade: '',
      uf:'',
      numero:'',
    }
  },
  methods: {
    getAdress(cep){
      console.log(cep);
      axios.get('https://viacep.com.br/ws/' + cep + '/json/').then( ret =>{
        console.log(ret);
         this.logradouro = ret.data.logradouro;
         this.bairro = ret.data.bairro;
         this.localidade = ret.data.localidade;
         this.uf = ret.data.uf;
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
