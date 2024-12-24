<template>
  <div>
    <h1>Список сотрудников</h1>

    <div>
      <label for="showWorker">Показать сотрудников в БД:</label>
      <select id="showWorker" v-model="selectedWorker" @change="resetForms">
        <option v-for="worker in lstWorker" :value="worker" :key="worker.id">
          {{ worker.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedWorker && !showAddWorkerForm && !showUpdateWorkerForm && !showDeleteWorkerForm">
      <h2>Информация о сотруднике</h2>
      <p>Имя: {{ selectedWorker.name }}</p>
      <p>Фамилия: {{ selectedWorker.surname }}</p>
      <p>Отчество: {{ selectedWorker.lastname }}</p>
      <p>Должность: {{ selectedWorker.type }}</p>
    </div>

    <div>
      <button @click="toggleAddWorkerForm">Добавить сотрудника</button>
    </div>

    <div>
      <button @click="toggleUpdateWorkerForm">Обновить сотрудника</button>
      <select v-if="showUpdateWorkerForm" v-model="selectedWorkerForUpdate">
        <option v-for="worker in lstWorker" :value="worker" :key="worker.id">
          {{ worker.name }}
        </option>
      </select>
    </div>

    <div>
      <button @click="toggleDeleteWorkerForm">Удалить сотрудника</button>
      <select v-if="showDeleteWorkerForm" v-model="selectedWorkerForDelete">
        <option v-for="worker in lstWorker" :value="worker" :key="worker.id">
          {{ worker.name }}
        </option>
      </select>
    </div>

    <div v-if="showAddWorkerForm">
      <h2>Добавить нового сотрудника</h2>
      <p>Имя: <input v-model="newWorker.name"></p>
      <p>Фамилия: <input v-model="newWorker.surname"></p>
      <p>Отчество: <input v-model="newWorker.lastname"></p>
      <p>Должность: <input v-model="newWorker.type"></p>
      <button @click="addWorker">Сохранить сотрудника</button>
    </div>

    <div v-if="showUpdateWorkerForm && selectedWorkerForUpdate">
      <h2>Обновить информацию о сотруднике</h2>
      <p>Имя: <input v-model="selectedWorkerForUpdate.name"></p>
      <p>Фамилия: <input v-model="selectedWorkerForUpdate.surname"></p>
      <p>Отчество: <input v-model="selectedWorkerForUpdate.lastname"></p>
      <p>Должность: <input v-model="selectedWorkerForUpdate.type"></p>
      <button @click="saveUpdatedWorker">Сохранить изменения</button>
    </div>

    <div v-if="showDeleteWorkerForm && selectedWorkerForDelete">
      <h2>Удалить сотрудника</h2>
      <p>Вы уверены, что хотите удалить клиента {{ selectedWorkerForDelete.name }}?</p>
      <button @click="confirmDeleteWorker">Да, удалить</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      lstWorker: [],
      selectedWorker: null,
      selectedWorkerForUpdate: null,
      selectedWorkerForDelete: null,
      newWorker: {
        name: '',
        surname: '',
        lastname: '',
        type: ''
      },
      showAddWorkerForm: false,
      showUpdateWorkerForm: false,
      showDeleteWorkerForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/worker');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await axios.get(this.host + refer);
        this.lstWorker = res.data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddWorkerForm: function() {
      this.resetForms();
      this.showAddWorkerForm = true;
    },
    toggleUpdateWorkerForm: function() {
      this.resetForms();
      this.showUpdateWorkerForm = true;
    },
    toggleDeleteWorkerForm: function() {
      this.resetForms();
      this.showDeleteWorkerForm = true;
    },
    resetForms: function() {
      this.showAddWorkerForm = false;
      this.showUpdateWorkerForm = false;
      this.showDeleteWorkerForm = false;
    },
    addWorker: async function() {
      if (!this.newWorker.name || !this.newWorker.surname || !this.newWorker.lastname) {
        console.log('Введите имя, адрес и телефон');
        return;
      }
      try {
        const res = await axios.post(this.host + '/worker', this.newWorker);
        this.lstWorker.push(res.data);
        this.showAddWorkerForm = false;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedWorker: async function() {
      if (!this.selectedWorkerForUpdate) {
        console.log('Выберите клиента для обновления');
        return;
      }
      try {
        const res = await axios.put(this.host + '/worker/' + this.selectedWorkerForUpdate.id, this.selectedWorkerForUpdate);
        const index = this.lstWorker.findIndex(worker => worker.id === res.data.id);
        this.lstWorker.splice(index, 1, res.data);
        this.showUpdateWorkerForm = false;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteWorker: async function() {
      if (!this.selectedWorkerForDelete) {
        console.log('Выберите клиента для удаления');
        return;
      }
      try {
        await axios.delete(this.host + '/worker/' + this.selectedWorkerForDelete.id);
        this.lstWorker = this.lstWorker.filter(worker => worker.id !== this.selectedWorkerForDelete.id);
        this.showDeleteWorkerForm = false;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>
