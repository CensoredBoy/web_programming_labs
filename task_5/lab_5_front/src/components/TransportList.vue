<template>
  <div>
    <h1>Список транспорта</h1>

    <div>
      <label for="showTransport">Показать транспорт в БД:</label>
      <select id="showTransport" v-model="selectedTransport">
        <option v-for="transport in lstTransport" :value="transport" :key="transport.id">
          {{ transport.name }}
        </option>
      </select>
    </div>

    <div>
      <button @click="toggleAddTransportForm">Добавить транспорт</button>
    </div>

    <div>
      <button @click="toggleUpdateTransportForm">Обновить транспорт</button>
      <select v-if="showUpdateTransportForm" v-model="selectedTransportForUpdate">
        <option v-for="transport in lstTransport" :value="transport" :key="transport.id">
          {{ transport.name }}
        </option>
      </select>
    </div>

    <div>
      <button @click="toggleDeleteTransportForm">Удалить транспорт</button>
      <select v-if="showDeleteTransportForm" v-model="selectedTransportForDelete">
        <option v-for="transport in lstTransport" :value="transport" :key="transport.id">
          {{ transport.name }}
        </option>
      </select>
    </div>

    <!-- Форма для добавления нового транспорта -->
    <div v-if="showAddTransportForm">
      <h2>Добавить новый транспорт</h2>
      <p>Имя: <input v-model="newTransport.name"></p>
      <button @click="addTransport">Сохранить транспорт</button>
    </div>

    <!-- Форма для обновления информации о транспорте -->
    <div v-if="showUpdateTransportForm && selectedTransportForUpdate">
      <h2>Обновить информацию о транспорте</h2>
      <p>Имя: <input v-model="selectedTransportForUpdate.name"></p>
      <button @click="saveUpdatedTransport">Сохранить изменения</button>
    </div>

    <!-- Форма для удаления транспорта -->
    <div v-if="showDeleteTransportForm && selectedTransportForDelete">
      <h2>Удалить транспорт</h2>
      <p>Вы уверены, что хотите удалить транспорт {{ selectedTransportForDelete.name }}?</p>
      <button @click="confirmDeleteTransport">Да, удалить</button>
    </div>

    <!-- Информация о выбранном транспорте -->
    <div v-if="selectedTransport">
      <h2>Информация о транспорте</h2>
      <p>Имя: <input v-model="selectedTransport.name"></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lstTransport: [],
      selectedTransport: null,
      selectedTransportForUpdate: null,
      selectedTransportForDelete: null,
      newTransport: {
        type: '',
        cost: ''
      },
      showAddTransportForm: false,
      showUpdateTransportForm: false,
      showDeleteTransportForm: false,
      host: 'http://localhost:8080'
    };
  },
  mounted() {
    this.getListByReference('/transport');
  },
  methods: {
    getListByReference: async function(refer) {
      try {
        const res = await fetch(this.host + refer);
        const data = await res.json();
        this.lstTransport = data;
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    toggleAddTransportForm: function() {
      this.showAddTransportForm = !this.showAddTransportForm;
      if (!this.showAddTransportForm) {
        this.newTransport = {
          name: ''
        };
      }
    },
    toggleUpdateTransportForm: function() {
      this.showUpdateTransportForm = !this.showUpdateTransportForm;
      if (!this.showUpdateTransportForm) {
        this.selectedTransportForUpdate = null;
      }
    },
    toggleDeleteTransportForm: function() {
      this.showDeleteTransportForm = !this.showDeleteTransportForm;
      if (!this.showDeleteTransportForm) {
        this.selectedTransportForDelete = null;
      }
    },
    addTransport: async function() {
      if (!this.newTransport.name) {
        console.log('Введите тип и стоимость транспорта');
        return;
      }
      try {
        const res = await fetch(this.host + '/transport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newTransport)
        });
        const data = await res.json();
        this.lstTransport.push(data);
        this.toggleAddTransportForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    saveUpdatedTransport: async function() {
      if (!this.selectedTransportForUpdate) {
        console.log('Выберите транспорт для обновления');
        return;
      }
      const updatedTransport = {
        id: this.selectedTransportForUpdate.id,
        name: this.selectedTransportForUpdate.name
      };
      try {
        const res = await fetch(this.host + '/transport/' + updatedTransport.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedTransport)
        });
        const data = await res.json();
        const index = this.lstTransport.findIndex(transport => transport.id === data.id);
        this.lstTransport.splice(index, 1, data);
        this.toggleUpdateTransportForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    },
    confirmDeleteTransport: async function() {
      if (!this.selectedTransportForDelete) {
        console.log('Выберите транспорт для удаления');
        return;
      }
      try {
        const res = await fetch(this.host + '/transport/' + this.selectedTransportForDelete.id, {
          method: 'DELETE'
        });
        const data = await res.json();
        const index = this.lstTransport.findIndex(transport => transport.id === data.id);
        this.lstTransport.splice(index, 1);
        this.toggleDeleteTransportForm();
      } catch (e) {
        console.log('Ошибка: ', e);
      }
    }
  }
};
</script>