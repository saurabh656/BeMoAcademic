<template>
  <modal name="add_edit_card">
    <div class="example-modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {{ cardId === 0 ? "Add Card" : "Edit Card" }}
        </h5>
        <button type="button" class="close" @click="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              class="form-control"
              v-model="$v.cardName.$model"
              :validate="$v.cardName"
              id="title"
              aria-describedby="titleHelp"
              placeholder="Enter Title"
            />
          </div>
          <div
            class="validation-div mb-2"
            v-if="
              typeof $v.cardName.required !== 'undefined' &&
              !$v.cardName.required &&
              $v.cardName.$error
            "
          >
            Title is required.
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              class="form-control"
              v-model="$v.cardDescription.$model"
              :validate="$v.cardDescription"
              id="description"
              rows="3"
            ></textarea>
          </div>
          <div
            class="validation-div mb-2"
            v-if="
              ((typeof $v.cardDescription.minLength !== 'undefined' &&
                !$v.cardDescription.minLength) ||
                (typeof $v.cardDescription.maxLength !== 'undefined' &&
                  !$v.cardDescription.maxLength)) &&
              $v.cardDescription.$error
            "
          >
            Description must be between
            {{ $v.cardDescription.$params.minLength.min }} and

            {{ $v.cardDescription.$params.maxLength.max }}.
          </div>
          <button
            type="button"
            @click="addCard"
            class="btn btn-primary"
            v-if="cardId === 0"
          >
            Add
          </button>
          <button
            type="button"
            @click="editCard"
            class="btn btn-primary"
            v-else
          >
            Edit
          </button>
          <button type="button" @click="close" class="btn btn-secondary ml-1">
            Close
          </button>
        </form>
      </div>
    </div>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    ></loading>
  </modal>
</template>

<script>
import { AddCard, EditCard } from "@/api/ColumnListApi.js";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "Card",
  data() {
    return {
      cardName: "",
      cardDescription: "",
      cardId: 0,
      isLoading: false,
    };
  },
  validations() {
    return {
      cardName: {
        required,
      },
      cardDescription: {
        minLength: minLength(2),
        maxLength: maxLength(150),
      },
    };
  },
  props: {
    columnId: {
      type: Number,
      default: 0,
    },
    cardDetails: {
      type: Object,
      default: null,
    },
  },
  methods: {
    addCard() {
      this.$v.$touch();
      if (this.cardName) {
        const data = {
          title: this.cardName,
          description: this.cardDescription,
          column_id: this.columnId,
        };
        this.isLoading = true;
        AddCard(data)
          .then((response) => {
            if (response.status === 201) {
              this.$emit("getColumnData");
              this.close();
              this.$toast.open({
                message: "Card Added Successfully.",
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
    editCard() {
      this.$v.$touch();
      if (this.cardName) {
        const data = {
          title: this.cardName,
          description: this.cardDescription,
          column_id: this.columnId,
        };
        this.isLoading = true;
        EditCard(this.cardId, data)
          .then((response) => {
            if (response.status === 200) {
              this.$emit("getColumnData");
              this.close();
              this.$toast.open({
                message: "Card Updated Successfully.",
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
    close() {
      this.$v.$reset();
      this.$emit("hide");
    },
  },
  watch: {
    cardDetails: {
      handler: function () {
        if (Object.entries(this.cardDetails).length !== 0) {
          this.cardName = this.cardDetails.title;
          this.cardDescription = this.cardDetails.description;
          this.cardId = this.cardDetails.id;
        } else {
          this.cardName = "";
          this.cardDescription = "";
          this.cardId = 0;
        }
      },
      deep: true,
    },
  },
};
</script>
