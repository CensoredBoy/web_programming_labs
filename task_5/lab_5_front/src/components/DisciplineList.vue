<template>
  <div>
    <h1>Список дисциплин</h1>

    <div>
      <label for="showDiscipline">Показать дисциплины в БД:</label>
      <select id="showDiscipline" v-model="selectedDiscipline" @change="resetForms">
        <option v-for="discipline in lstDiscipline" :value="discipline" :key="discipline.id">
          {{ discipline.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedDiscipline && !showAddDisciplineForm && !showUpdateDisciplineForm && !showDeleteDisciplineForm">
      <h2>Информация о дисциплине</h2>
      <p>Имя: {{ selectedDiscipline.name }}</p>
      <p>Фамилия преподавателя: {{ selectedDiscipline.lastname }}</p>
    </div>

    <div>
      <button @click="toggleAddDisciplineForm">Добавить дисциплину</button>
    </div>

    <div>
      <button @click="toggleUpdateDisciplineForm">Обновить дисциплину</button>
      <select v-if="showUpdateDisciplineForm" v-model="selectedDisciplineForUpdate">
        <option v-for="discipline in lstDiscipline" :value="discipline" :key="discipline.id">
          {{ discipline.name }}
        </option>
      </select>
    </div>

    <div>
      <button @click="toggleDeleteWorkerForm">Удалить дисциплину</button>
      <select v-if="showDeleteDisciplineForm" v-model="selectedDisciplineForDelete">
        <option v-for="discipline in lstDiscipline" :value="discipline" :key="discipline.id">
          {{ discipline.name }}
        </option>
      </select>
    </div>

    <div v-if="showAddDisciplineForm">
      <h2>Добавить новую дисциплину</h2>
      <p>Имя: <input v-model="newDiscipline.name"></p>
      <p>Фамилия преподавателя: <input v-model="newDiscipline.lastname"></p>
      <button @click="addDiscipline">Сохранить дисциплину</button>
    </div>

    <div v-if="showUpdateDisciplineForm && selectedDisciplineForUpdate">
      <h2>Обновить информацию о дисциплине</h2>
      <p>Имя: <input v-model="selectedDisciplineForUpdate.name"></p>
      <p>Фамилия преподавателя: <input v-model="selectedDisciplineForUpdate.lastname"></p>
      <button @click="saveUpdatedDiscipline">Сохранить изменения</button>
    </div>

    <div v-if="showDeleteDisciplineForm && selectedDisciplineForDelete">
      <h2>Удалить дисциплину</h2>
      <p>Вы уверены, что хотите удалить дисциплину {{ selectedDisciplineForDelete.name }}?</p>
      <button @click="confirmDeleteDiscipline">Да, удалить</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      lstDiscipline: [],
      selectedDiscipline: null,
      selectedDisciplineForUpdate: null,
      selectedDisciplineForDelete: null,
      newDiscipline: {
        name: '',
        lastname: ''
      },
      showAddDisciplineForm: false,
      showUpdateDisciplineForm: false,
      showDeleteDisciplineForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/discipline');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await axios.get(this.host + refer);
        this.lstDiscipline = res.data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddDisciplineForm: function() {
      this.resetForms();
      this.showAddDisciplineForm = true;
    },
    toggleUpdateDisciplineForm: function() {
      this.resetForms();
      this.showUpdateDisciplineForm = true;
    },
    toggleDeleteWorkerForm: function() {
      this.resetForms();
      this.showDeleteDisciplineForm = true;
    },
    resetForms: function() {
      this.showAddDisciplineForm = false;
      this.showUpdateDisciplineForm = false;
      this.showDeleteDisciplineForm = false;
    },
    addDiscipline: async function() {
      if (!this.newDiscipline.name || !this.newDiscipline.lastname) {
        console.log('Введите имя, адрес и телефон');
        return;
      }
      try {
        const res = await axios.post(this.host + '/discipline', this.newDiscipline);
        this.lstDiscipline.push(res.data);
        this.showAddWorkerForm = false;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedDiscipline: async function() {
      if (!this.selectedDisciplineForUpdate) {
        console.log('Выберите клиента для обновления');
        return;
      }
      try {
        const res = await axios.put(this.host + '/discipline/' + this.selectedDisciplineForUpdate.id, this.selectedDisciplineForUpdate);
        const index = this.lstDiscipline.findIndex(discipline => discipline.id === res.data.id);
        this.lstDiscipline.splice(index, 1, res.data);
        this.showUpdateDisciplineForm = false;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteDiscipline: async function() {
      if (!this.selectedDisciplineForDelete) {
        console.log('Выберите клиента для удаления');
        return;
      }
      try {
        await axios.delete(this.host + '/discipline/' + this.selectedDisciplineForDelete.id);
        this.lstWorker = this.lstDiscipline.filter(discipline => discipline.id !== this.selectedDisciplineForDelete.id);
        this.showDeleteWorkerForm = false;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>
