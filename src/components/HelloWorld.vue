<template>
  <div>
    <b-container>
      <h1>Lista de endereços</h1>
      <b-row>
        <b-col>
          <b-row>

            <b-col>
              <label>Nome:</label>
            </b-col>
            <b-col>
              <input class="input-sm" type="text" v-model="nome"/>
            </b-col>

          </b-row>
          <b-row>

            <b-col>
              <label>Cep</label>
            </b-col>

            <b-col>
              <input class="input-sm" type="number" v-model="cep"/>
            </b-col>

            <b-col>
              <button class="btn btn-default" @click="getAdress(cep)">Enviar</button>
            </b-col>

          </b-row>
          <b-row>
            {{logradouro}} {{bairro}} {{localidade}}
            {{numero}} {{complemento}}
          </b-row>
          <b-row>

            <b-col>
              <label>Numero:</label>
            </b-col>

            <b-col>
              <input class="input-sm" type="number" v-model="numero"/>
            </b-col>

          </b-row>
          <b-row>

            <b-col>
              <label>Completemento:</label>
            </b-col>

            <b-col>
              <input class="input-sm" type="text" v-model="complemento"/>
            </b-col>


          </b-row>
          <b-row>
            <b-col align-self="end">
              <button class="btn btn-default" v-if="!editar" @click="adicionarEndereco">Adicionar</button>
              <button class="btn btn-default" v-else @click="editaEndereco">Editar</button>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <ul class="list-group">
            <li class="list-group-item" v-for="(local, i) in enderecos" :key="i">
              {{local.nome}} - {{local.cep}}
              <span @click="removerEndereco(i)" class="fas fa-times"></span>
              <span @click="habilitarEdicao(i)" class="fas fa-pencil-alt"></span>
            </li>
          </ul>
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'HelloWorld',
    data() {
      return {
        editar: false,
        enderecoIndex:'',
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
    created() {
      let storageLocal = JSON.parse(localStorage.getItem('enderecos'));
      console.log(storageLocal);
      if(storageLocal){
        this.enderecos = storageLocal;
      }
    },
    watch: {
      enderecos() {
        
        localStorage.setItem('enderecos', JSON.stringify(this.enderecos));
        
        console.log(JSON.parse(localStorage.getItem('enderecos')));
        
      }
    },
    methods: {
      editaEndereco(){
        this.enderecos[this.enderecoIndex] = {
          nome: this.nome,
          cep: this.cep,
          localidade: this.localidade,
          logradouro: this.logradouro,
          bairro: this.bairro,
          numero: this.numero,
          complemento: this.complemento,
          uf: this.uf
        };
        this.limparInfos();
        this.editar = false;

      },
      habilitarEdicao(index){
        this.enderecoIndex = index;
        this.editar = true;
        console.log(this.enderecos[index]);
          this.nome = this.enderecos[index].nome;
          this.cep = this.enderecos[index].cep;
          this.localidade = this.enderecos[index].localidade;
          this.logradouro = this.enderecos[index].logradouro;
          this.bairro = this.enderecos[index].bairro;
          this.numero = this.enderecos[index].numero;
          this.complemento = this.enderecos[index].complemento;
          this.uf = this.enderecos[index].uf;
      },
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

<!--b-container>
  <b-row>
    <b-col> 1 of 3</b-col>
    <b-col> 2 of 3</b-col>
    <b-col> 3 of 3</b-col>
  </b-row>
</b-container-->
