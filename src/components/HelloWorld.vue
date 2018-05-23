<template>
  <div>
    <div>
      <h1>Ache o endereço com o CEP!</h1>
      <label>Cep</label><input type="number" v-model="cep"/><button @click="getAdress(cep)">Enviar</button>
      <label>Numero:</label><input type="number" v-model="numero"/>
      <label>Completemento:</label><input type="text" v-model="complemento"/>
      <label>Nome:</label><input type="text" v-model="nome"/>
      {{logradouro}} {{bairro}} {{localidade}}
      {{numero}} {{complemento}}
      <button @click="adicionarEndereco">Adicionar</button>
    </div>
    <div>
      <ul>
        <li v-for="(local, i) in enderecos" :key="i">
          {{local.nome}} - {{local.cep}}
          <span @click="removerEndereco(i)">X</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage'

export default {
  name: 'HelloWorld',
    data() {
      return {
        nome: '',
        cep: '',
        logradouro: '',
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
        numero: '',
        enderecos: []
      }
    },
    watch: {
      enderecos(value) {
        console.log(this.enderecos);
        console.log(value);
        console.log(this.$localStorage.get('enderecos'));
        this.$localStorage.set('enderecos', 'foi bagaça');
      }
    },
    methods: {
      removerEndereco(index) {
        this.enderecos.splice(index, 1);
      },
      adicionarEndereco() {
        this.enderecos.unshift({
          nome: this.nome,
          cep: this.cep,
          localidade: this.localidade,
          logradouro: this.logradouro,
          bairro: this.bairro,
          numero: this.numero,
          complemento: this.complemento,
          uf: this.uf
        });
        this.limparInfos();
      },
      limparInfos() {
        this.cep = '';
        this.localidade = '';
        this.logradouro = '';
        this.bairro = '';
        this.numero = '';
        this.complemento = '';
        this.uf = '';
      },
      getAdress(cep) {
        console.log(cep);
        axios.get('https://viacep.com.br/ws/' + cep + '/json/').then(ret => {
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
