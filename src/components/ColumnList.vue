<template>
  <div>
    <div class="container">
      <div class="row">
        <div
          class="col-3 padding"
          v-for="{ id, title, cards } of columnData"
          :key="id"
        >
          <div class="p-2 alert alert-success column">
            <h5>
              {{ title }}
              <button
                type="button"
                class="close"
                aria-label="Close"
                @click="deleteColumn(id)"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </h5>
            <draggable
              class="list-group Column-height"
              :list="cards"
              group="tasks"
              @change="handleChange(id, $event)"
            >
              <div
                class="list-group-item"
                v-for="(element, index) in cards"
                :key="index"
              >
                <a role="button" @click="editCard(id, element)">
                  {{ element.title }}
                </a>
              </div>
            </draggable>
            <button class="btn btn-primary btn-block" @click="addCard(id)">
              Add Card
            </button>
          </div>
        </div>
        <div class="col-sm padding">
          <div class="input-group mb-2">
            <input
              id="input-2"
              class="form-control"
              v-model="$v.columnName.$model"
              :validate="$v.columnName"
              placeholder="Enter Column Title"
            />
          </div>
          <div
            class="validation-div mb-2"
            v-if="
              typeof $v.columnName.required !== 'undefined' &&
              !$v.columnName.required &&
              $v.columnName.$error
            "
          >
            Column Title is required.
          </div>
          <button class="btn btn-primary" @click="addColumn">Add Column</button>
        </div>
      </div>
    </div>
    <AddEditCard
      :columnId="columnId"
      @getColumnData="getColumnData"
      :cardDetails="cardDetails"
      @hide="hide"
    />
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    ></loading>
  </div>
</template>

<script>
import AddEditCard from "./AddEditCard.vue";
import draggable from "vuedraggable";
import {
  ColumnList,
  AddColumn,
  DeleteColumn,
  CardColumnChange,
} from "@/api/ColumnListApi.js";
import { required } from "vuelidate/lib/validators";

export default {
  name: "Drag-Drop",
  components: {
    AddEditCard,
    draggable,
  },
  data() {
    return {
      cardsData: [],
      columnData: [],
      columnName: "",
      columnId: 0,
      cardDetails: {},
      isLoading: false,
    };
  },
  validations() {
    return {
      columnName: {
        required,
      },
    };
  },
  mounted() {
    this.getColumnData();
  },
  methods: {
    handleChange(id, event) {
      const Column_id = id;
      const Card_id = event.added.element.id;
      CardColumnChange(Card_id, Column_id).then((response) => {
        if (response.status === 200) {
          this.$toast.open({
            message: "Moved Successfully.",
            type: "success",
            duration: 2000,
            dismissible: true,
            position: "top-right",
          });
        }
      });
    },
    getColumnData() {
      ColumnList().then((response) => {
        this.columnData = response.data;
        this.id = response.data[1].id;
      });
    },
    deleteColumn(id) {
      DeleteColumn(id).then((response) => {
        if (response.status === 204) {
          this.getColumnData();
          this.$toast.open({
            message: "Column Deleted Successfully.",
            type: "success",
            duration: 2000,
            dismissible: true,
            position: "top-right",
          });
        }
      });
    },
    addCard(columnId) {
      this.cardDetails = {};
      this.columnId = columnId;
      this.$modal.show("add_edit_card");
    },
    editCard(columnId, cardDetails) {
      this.columnId = columnId;
      this.cardDetails = cardDetails;
      this.$modal.show("add_edit_card");
    },
    hide() {
      this.cardDetails = {};
      this.$modal.hide("add_edit_card");
    },
    addColumn() {
      this.$v.$touch();
      if (this.columnName) {
        const data = {
          title: this.columnName,
        };
        this.isLoading = true;
        AddColumn(data)
          .then((response) => {
            if (response.status === 201) {
              this.getColumnData();
              this.columnName = "";
              this.$v.columnName.$reset();
              this.$toast.open({
                message: "Column Added Successfully.",
                type: "success",
                duration: 2000,
                dismissible: true,
                position: "top-right",
              });
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
  },
};
</script>
