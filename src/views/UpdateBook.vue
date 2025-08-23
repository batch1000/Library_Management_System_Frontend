<template>
  <div class="detailbook container">
    <div class="wrapper-search">
      <div class="book__library-list-toolbar-search">
        <span class="search-icon">
          <i class="fas fa-search"></i>
        </span>
        <input type="text" placeholder="Tìm kiếm sách..." ref="searchInput" />
      </div>
      <button class="search-button" @click="handleSearch">Tìm kiếm</button>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <div class="detailbook__image-book">
          <div class="detailbook__image-book-input-wrapper">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              @change="onFileChange"
              style="display: none"
            />
            <label
              for="fileInput"
              class="camera-label"
              :style="{
                pointerEvents: isBookLoaded ? 'auto' : 'none',
                opacity: isBookLoaded ? 1 : 0.5,
              }"
            >
              <div class="camera-icon">
                <i class="fas fa-camera"></i>
              </div>
            </label>
          </div>
          <img v-if="imagePreview" :src="imagePreview" alt="Preview" />
        </div>
      </div>

      <div class="col-lg-6">
        <div class="detailbook__information-book">
          <div class="detailbook__information-book-header">
            <div>
              <span class="title">Mã sách: </span>
              <input
                type="text"
                class="detailbook__information-book-title"
                v-model="bookCode"
                disabled
              />
            </div>

            <span class="title">Tên sách: </span>
            <input
              type="text"
              class="detailbook__information-book-title"
              v-model="bookTitle"
              :disabled="!isBookLoaded"
            />
            <div class="detailbook__information-book-header-wrapper">
              <div class="detailbook__information-book-author">
                <span class="title">Tác giả: </span>
                <input
                  type="text"
                  v-model="bookAuthor"
                  :disabled="!isBookLoaded"
                />
              </div>

              <div class="detailbook__information-book-quantity-wrapper">
                <div class="detailbook__information-book-quantity-title">
                  <span class="title">Số quyển: </span>
                  <input
                    type="text"
                    v-model="bookQuantity"
                    :disabled="!isBookLoaded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="detailbook__information-book-price-and-info">
            <span class="title">Giá sách (VD: 50000 = 50.000đ): </span>
            <input type="text" v-model="bookPrice" :disabled="!isBookLoaded" />

            <span class="title">Mô tả sách: </span>
            <textarea
              class="detailbook__information-book-description"
              rows="4"
              v-model="bookDescription"
              :disabled="!isBookLoaded"
            ></textarea>
          </div>

          <div class="detailbook__information-book-publishing">
            <div class="detailbook__information-book-publishing-title">
              Nhà xuất bản:
            </div>
            <input
              type="text"
              class="detailbook__information-book-publishing-content"
              v-model="bookPublisher"
              :disabled="!isBookLoaded"
            />

            <div class="detailbook__information-book-publishing-title">
              Năm xuất bản:
            </div>
            <input
              type="text"
              class="detailbook__information-book-publishing-content"
              v-model="bookPublishYear"
              :disabled="!isBookLoaded"
            />

            <div class="detailbook__information-book-publishing-title">
              Địa chỉ xuất bản:
            </div>
            <input
              type="text"
              class="detailbook__information-book-publishing-content"
              v-model="bookPublisherAddress"
              :disabled="!isBookLoaded"
            />

            <div class="detailbook__information-book-publishing-title">
              Thể loại:
            </div>
            <select
              v-model="selectedGenre"
              name="genre"
              required
              :disabled="!isBookLoaded"
            >
              <option disabled value="">-- Chọn thể loại --</option>
              <option
                v-for="genre in genres"
                :key="genre._id"
                :value="genre.TenTheLoai"
              >
                {{ genre.TenTheLoai }}
              </option>
            </select>
          </div>

          <div class="detailbook__information-book-button">
            <button
              type="button"
              class="detailbook__information-book-btn"
              @click="updateBook"
              :disabled="!isBookLoaded"
            >
              Cập nhật sách
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="isLoading"
    :style="{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }"
  >
    <img :src="loadingGif" alt="loading" style="width: 60px; height: 60px" />
  </div>
</template>

<script>
import "../assets/css/updateBook.css";

import { bookService } from "../services/book/book.service";
import loadingGif from "/image/loading.gif";
export default {
  name: "UpdateBook",
  data() {
    return {
      imageFile: null,
      imagePreview: null,
      genres: [],
      selectedGenre: "",
      bookId: "",
      bookCode: "",
      bookTitle: "",
      bookAuthor: "",
      bookQuantity: "",
      bookPrice: "",
      bookDescription: "",
      bookPublisher: "",
      bookPublishYear: "",
      bookPublisherAddress: "",
      originalBookData: {},
      isBookLoaded: false,
      isLoading: false,
      loadingGif,
    };
  },
  mounted() {
    this.fetchGenres();
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },

    async fetchGenres() {
      try {
        const response = await bookService.getAllGenre();
        this.genres = response;
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      }
    },

    async handleSearch() {
      const keyword = this.$refs.searchInput.value.trim();
      if (!keyword) {
        alert("Vui lòng nhập từ khóa tìm kiếm.");
        return;
      }

      try {
        const book = await bookService.getOneBook(keyword);
        if (book) {
          this.bookId = book._id;
          this.bookCode = book.MaSach;
          this.bookTitle = book.TenSach;
          this.bookAuthor = book.TacGia;
          this.bookQuantity = book.SoQuyen.toString();
          this.bookPrice = book.DonGia.toString();
          this.bookDescription = book.MoTaSach;
          this.bookPublisher = book.MaNXB?.TenNXB || "";
          this.bookPublisherAddress = book.MaNXB?.DiaChi || "";
          this.bookPublishYear = book.NamXuatBan?.toString() || "";
          this.selectedGenre = book.MaTheLoai?.TenTheLoai || "";
          this.imagePreview = book.Image || "";
          this.imageFile = null;

          this.originalBookData = {
            bookCode: book.MaSach,
            bookTitle: book.TenSach,
            bookAuthor: book.TacGia,
            bookQuantity: book.SoQuyen.toString(),
            bookPrice: book.DonGia.toString(),
            bookDescription: book.MoTaSach,
            bookPublisher: book.MaNXB?.TenNXB || "",
            bookPublisherAddress: book.MaNXB?.DiaChi || "",
            bookPublishYear: book.NamXuatBan?.toString() || "",
            selectedGenre: book.MaTheLoai?.TenTheLoai || "",
            imagePreview: book.Image || "",
          };

          this.isBookLoaded = true;
        } else {
          alert("Không tìm thấy sách nào.");
        }
      } catch (error) {
        console.error("Lỗi khi tìm sách:", error);
        alert("Đã xảy ra lỗi khi tìm sách.");
      }
    },

    getChangedFields() {
      const changedFields = {};

      if (this.bookTitle !== this.originalBookData.bookTitle) {
        changedFields.TenSach = this.bookTitle;
      }
      if (this.bookAuthor !== this.originalBookData.bookAuthor) {
        changedFields.TacGia = this.bookAuthor;
      }
      if (this.bookQuantity !== this.originalBookData.bookQuantity) {
        changedFields.SoQuyen = parseInt(this.bookQuantity);
      }
      if (this.bookPrice !== this.originalBookData.bookPrice) {
        changedFields.DonGia = parseFloat(this.bookPrice);
      }
      if (this.bookDescription !== this.originalBookData.bookDescription) {
        changedFields.MoTaSach = this.bookDescription;
      }

      const publisherChanged =
        this.bookPublisher !== this.originalBookData.bookPublisher;
      const addressChanged =
        this.bookPublisherAddress !==
        this.originalBookData.bookPublisherAddress;

      if (publisherChanged || addressChanged) {
        changedFields.TenNXB = this.bookPublisher;
        changedFields.DiaChiNXB = this.bookPublisherAddress;
      }

      if (this.bookPublishYear !== this.originalBookData.bookPublishYear) {
        changedFields.NamXuatBan = parseInt(this.bookPublishYear);
      }
      if (this.selectedGenre !== this.originalBookData.selectedGenre) {
        changedFields.TenTheLoai = this.selectedGenre;
      }

      if (this.imageFile) {
        changedFields.image = this.imageFile;
      }

      return changedFields;
    },

    async updateBook() {
      const changedFields = this.getChangedFields();

      if (Object.keys(changedFields).length === 0) {
        alert("Không có thay đổi nào để cập nhật.");
        return;
      }

      try {
        this.isLoading = true;

        const formData = new FormData();
        for (const key in changedFields) {
          formData.append(key, changedFields[key]);
        }

        await bookService.updateBook(this.bookId, formData);
        alert("Cập nhật sách thành công.");

        this.originalBookData = {
          bookCode: this.bookCode,
          bookTitle: this.bookTitle,
          bookAuthor: this.bookAuthor,
          bookQuantity: this.bookQuantity,
          bookPrice: this.bookPrice,
          bookDescription: this.bookDescription,
          bookPublisher: this.bookPublisher,
          bookPublisherAddress: this.bookPublisherAddress,
          bookPublishYear: this.bookPublishYear,
          selectedGenre: this.selectedGenre,
          imagePreview: this.imagePreview,
        };

        this.imageFile = null;
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
        alert("Đã xảy ra lỗi khi cập nhật sách.");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>