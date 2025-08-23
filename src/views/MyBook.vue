<template>
  <Header />

  <div class="book__library">
    <div class="container">
      <div class="book__library-list-wrapper">
        <div class="book__library-list">
          <div class="book__library-list-toolbar">
            <div class="book__library-list-toolbar-search">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm theo mã hoặc tên sách..."
                v-model="searchKeyword"
              />
            </div>

            <div class="book__library-list-toolbar-sort">
              <label for="sort">Lọc theo trạng thái:</label>
              <select id="sort" v-model="sortOption">
                <option value="all">Tất cả</option>
                <option value="favorite">Yêu thích</option>
                <option value="approved">Đang mượn</option>
                <option value="returned">Đã trả</option>
                <option value="overdue">Quá hạn</option>
                <option value="denied">Bị từ chối</option>
              </select>
            </div>
          </div>

          <div class="book__library-list-book">
            <div class="row book__library-list-book-row">
              <div v-if="paginatedBooks.length === 0" class="no-books-message">
                📚 Bạn chưa mượn quyển sách nào
              </div>

              <div
                class="col-lg-3 book__library-list-book-element-wrapper"
                v-for="book in paginatedBooks"
                :key="book._id"
              >
                <div class="book__library-list-book-element">
                  <div
                    v-if="isFavorite(book.MaSach._id)"
                    class="badge-favorite"
                  >
                    <span>❤️</span> Yêu thích
                  </div>

                  <div
                    class="book__library-list-book-element-image"
                    @click="goToBookDetail(book.MaSach._id)"
                  >
                    <img :src="book.MaSach.Image" alt="" />

                    <div class="home__book-action-icon">
                      <div
                        class="home__book-action-favorite-icon"
                        :class="{ favorite: isFavorite(book.MaSach._id) }"
                        @click.stop="toggleFavorite(book)"
                      >
                        <i class="fa-solid fa-heart"></i>
                      </div>

                      <div class="home__book-action-preview-icon">
                        <i class="fa-regular fa-eye"></i>
                      </div>

                      <div class="home__book-action-borrow-icon">
                        <i class="fa-solid fa-book-medical"></i>
                      </div>
                    </div>
                  </div>

                  <div class="book__library-list-book-element-information">
                    <div
                      class="book__library-list-book-element-title"
                      @click="goToBookDetail(book.MaSach._id)"
                    >
                      {{ book.MaSach.TenSach }}
                    </div>

                    <!-- BỎ rating vì không liên quan đến mượn sách -->

                    <div class="book__library-list-book-element-author">
                      {{ book.MaSach.TacGia }}
                    </div>

                    <!-- THÊM thông tin mượn sách -->
                    <div
                      class="book__library-list-book-element-quantity"
                      v-if="book.TrangThai !== 'not_borrowed'"
                    >
                      Số lượng: {{ book.SoLuong }}
                    </div>

                    <div
                      class="book__library-list-book-element-status"
                      :class="'status-' + book.TrangThai"
                    >
                      {{ getStatusText(book.TrangThai) }}
                    </div>

                    <div
                      class="book__library-list-book-element-date"
                      v-if="book.NgayMuon && book.TrangThai !== 'not_borrowed'"
                    >
                      Ngày mượn: {{ formatDate(book.NgayMuon) }}
                    </div>

                    <div
                      class="book__library-list-book-element-return-date"
                      v-if="book.NgayTra && book.TrangThai !== 'not_borrowed'"
                    >
                      Ngày trả: {{ formatDate(book.NgayTra) }}
                    </div>

                    <div
                      class="book__library-list-book-element-extended"
                      v-if="book.DaGiaHan && book.TrangThai !== 'not_borrowed'"
                    >
                      <span class="extended-badge">Đã gia hạn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="book__library-list-book-navigation-page"
              v-if="sortedBooks.length > 0"
            >
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="goToPage(1)"
                    >«</a
                  >
                </li>

                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(currentPage - 1)"
                    >‹</a
                  >
                </li>

                <li class="page-item active">
                  <a class="page-link" href="#" @click.prevent>{{
                    currentPage
                  }}</a>
                </li>

                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(currentPage + 1)"
                    >›</a
                  >
                </li>

                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(totalPages)"
                    >»</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script>
import "../assets/css/mybook.css";

import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

import { bookService } from "../services/book/book.service";
import { userState } from "../assets/js/userState";

export default {
  name: "MyBook",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 12,
      sortOption: "all",
      searchKeyword: "",
      favoriteBookIds: [],
      allFavoriteBooks: [],
    };
  },
  async mounted() {
    const pageFromURL = parseInt(this.$route.query.page);
    if (!isNaN(pageFromURL) && pageFromURL >= 1) {
      this.currentPage = pageFromURL;
    }

    try {
      const response = await bookService.getBorrowBookOfUser(userState._id);
      if (Array.isArray(response)) {
        this.books = response;
      }

      if (userState._id) {
        const favResponse = await bookService.getFavoriteBooks(userState._id);
        this.favoriteBookIds = Array.isArray(favResponse)
          ? favResponse.map((id) => id.toString())
          : [];

        if (this.favoriteBookIds.length > 0) {
          const favoriteDetailsPromises = this.favoriteBookIds.map((bookId) =>
            bookService.getBookById(bookId)
          );
          const favoriteDetails = await Promise.all(favoriteDetailsPromises);
          this.allFavoriteBooks = favoriteDetails.filter((book) => book); // Lọc bỏ null/undefined
        }
      }
    } catch (error) {
      alert("Lỗi khi lấy sách!");
    }
  },
  methods: {
    formatPrice(value) {
      if (typeof value !== "number") return value;
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.$router.push({ query: { ...this.$route.query, page: page } });
      }
    },

    goToBookDetail(bookId) {
      this.$router.push({ name: "DetailBook", params: { id: bookId } });
    },

    getStatusText(status) {
      const statusMap = {
        pending: "Chờ duyệt",
        approved: "Đang mượn",
        denied: "Bị từ chối",
        returned: "ĐẢ TRẢ",
        overdue: "Quá hạn",
        not_borrowed: "Chưa mượn",
      };
      return statusMap[status] || status;
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    },

    async toggleFavorite(book) {
      try {
        const maDocGia = userState._id;
        if (!maDocGia) {
          alert("Bạn cần đăng nhập để thêm yêu thích");
          return;
        }

        const bookId = book.MaSach._id.toString(); // Lưu ý: book.MaSach._id vì cấu trúc khác Library

        if (this.isFavorite(bookId)) {
          const data = { MaSach: bookId, MaDocGia: maDocGia };
          await bookService.deleteFavoriteBook(data);
          this.favoriteBookIds = this.favoriteBookIds.filter(
            (id) => id.toString() !== bookId
          );
          alert("Đã bỏ yêu thích!");
        } else {
          const data = { MaSach: bookId, MaDocGia: maDocGia };
          await bookService.addFavoriteBook(data);
          this.favoriteBookIds.push(bookId);
          alert("Đã thêm vào danh sách yêu thích!");
        }
      } catch (error) {
        console.error("Lỗi khi toggle yêu thích:", error);
        alert("Có lỗi xảy ra khi thay đổi yêu thích!");
      }
    },

    isFavorite(bookId) {
      if (!this.favoriteBookIds || !bookId) return false;
      const bid = bookId.toString();
      return this.favoriteBookIds.some((id) => id.toString() === bid);
    },
  },
  computed: {
    filteredBooks() {
      let result = this.books;

      // Filter theo search keyword
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase().trim();
        result = result.filter((book) => {
          const tenSach = book.MaSach.TenSach.toLowerCase();
          const maSach = book.MaSach.MaSach.toLowerCase();
          return tenSach.includes(keyword) || maSach.includes(keyword);
        });
      }

      return result;
    },

    sortedBooks() {
      let filtered = this.filteredBooks;

      // THÊM sách yêu thích chưa mượn vào danh sách "Tất cả"
      if (this.sortOption === "all" || this.sortOption === "favorite") {
        // Tìm những sách yêu thích chưa có trong danh sách đã mượn
        const unborrowedFavorites = this.allFavoriteBooks
          .filter(
            (favBook) =>
              !this.books.some(
                (borrowedBook) =>
                  borrowedBook.MaSach._id.toString() === favBook._id.toString()
              )
          )
          .map((favBook) => ({
            _id: `fav_${favBook._id}`,
            MaSach: favBook,
            TrangThai: "not_borrowed",
            SoLuong: 0,
            NgayMuon: null,
            NgayTra: null,
            DaGiaHan: false,
          }));

        if (this.sortOption === "favorite") {
          // Chỉ hiển thị sách yêu thích (cả đã mượn và chưa mượn)
          const borrowedFavorites = filtered.filter((book) =>
            this.isFavorite(book.MaSach._id)
          );
          filtered = [...borrowedFavorites, ...unborrowedFavorites];
        } else {
          // "Tất cả": hiển thị sách đã mượn + sách yêu thích chưa mượn
          filtered = [...filtered, ...unborrowedFavorites];
        }
      } else if (
        this.sortOption !== "all" &&
        !["new", "title"].includes(this.sortOption)
      ) {
        filtered = filtered.filter(
          (book) => book.TrangThai === this.sortOption
        );
      }

      // Sắp xếp theo tiêu chí
      if (this.sortOption === "new") {
        return [...filtered].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      } else if (this.sortOption === "title") {
        return [...filtered].sort((a, b) =>
          a.MaSach.TenSach.localeCompare(b.MaSach.TenSach, "vi", {
            sensitivity: "base",
          })
        );
      }

      return filtered;
    },

    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedBooks.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.sortedBooks.length / this.pageSize);
    },
  },
  watch: {
    "$route.query.page"(newPage) {
      const page = parseInt(newPage);
      if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    sortOption() {
      this.goToPage(1);
    },

    searchKeyword() {
      this.goToPage(1);
    },
  },

  beforeRouteEnter(to, from, next) {
    next(() => {
      window.scrollTo(0, 0);
    });
  },
};
</script>