<template>
  <Header />

  <div class="book__library">
    <div class="container-fluid">
      <div class="row d-flex align-items-start">
        <div class="col-lg-3 book__library-filter-wrapper">
          <div class="book__library-filter">
            <div class="book__library-filter-title">Thể loại</div>
            <div class="book__library-filter-content">
              <div class="form-check" v-for="genre in genres" :key="genre._id">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="genre._id"
                  :id="'genre' + genre._id"
                  v-model="selectedGenres"
                />
                <label class="form-check-label" :for="'genre' + genre._id">
                  {{ genre.TenTheLoai }}
                </label>
              </div>
            </div>
          </div>

          <div class="book__library-filter">
            <div class="book__library-filter-title">Đánh giá</div>
            <div class="book__library-filter-content">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="5"
                  id="rating5"
                />
                <label class="form-check-label" for="rating5">
                  <div class="rating">
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                  </div>
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="4"
                  id="rating4"
                />
                <label class="form-check-label" for="rating4">
                  <div class="rating">
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star">☆</span>
                  </div>
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value="3"
                  id="rating3"
                />
                <label class="form-check-label" for="rating3">
                  <div class="rating">
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star">☆</span>
                    <span class="star">☆</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9 book__library-list-wrapper">
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
                <label for="sort">Sắp xếp:</label>
                <select id="sort" v-model="sortOption">
                  <option value="popular">Phổ biến nhất</option>
                  <option value="new">Mới nhất</option>
                  <option value="title">Tên sách (A–Z)</option>
                </select>
              </div>
            </div>

            <div class="book__library-list-book">
              <div class="row book__library-list-book-row">
                <div
                  class="col-lg-3 book__library-list-book-element-wrapper"
                  v-for="book in paginatedBooks"
                  :key="book._id"
                >
                  <div class="book__library-list-book-element">
                    <div v-if="isFavorite(book._id)" class="badge-favorite">
                      <span>❤️</span> Yêu thích
                    </div>

                    <div
                      class="book__library-list-book-element-image"
                      @click="goToBookDetail(book._id)"
                    >
                      <img :src="book.Image" alt="" />

                      <div class="home__book-action-icon">
                        <div
                          class="home__book-action-favorite-icon"
                          :class="{ favorite: isFavorite(book._id) }"
                          @click.stop="toggleFavorite(book)"
                        >
                          <i class="fa-solid fa-heart"></i>
                        </div>

                        <div
                          class="home__book-action-preview-icon"
                          @click="goToBookDetail(book._id)"
                        >
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
                        @click="goToBookDetail(book._id)"
                      >
                        {{ book.TenSach }}
                      </div>

                      <div class="rating">
                        <div
                          style="padding: 4px 4px 4px 0"
                          class="non-rating"
                          v-if="!book.averageRating || book.averageRating === 0"
                        >
                          <span>Chưa có đánh giá</span>
                        </div>

                        <div class="rating" v-else>
                          <span
                            v-for="index in 5"
                            :key="index"
                            class="star"
                            :style="getStarStyle(book.averageRating, index)"
                          >
                            ★
                          </span>
                        </div>
                      </div>

                      <div class="book__library-list-book-element-author">
                        {{ book.TacGia }}
                      </div>

                      <div class="book__library-list-book-element-price">
                        {{ formatPrice(book.DonGia) }}
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
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <a class="page-link" href="#" @click.prevent="goToPage(1)"
                      >«</a
                    >
                  </li>

                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
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
  </div>

  <Footer />
</template>

<script>
import "../assets/css/library.css";
import { userState } from "../assets/js/userState";

import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

import { bookService } from "../services/book/book.service";

export default {
  name: "Library",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      genres: [],
      books: [],
      currentPage: 1,
      pageSize: 12,
      sortOption: "popular",
      selectedGenres: [],
      searchKeyword: "",
      favoriteBookIds: [],
      averageRating: 0,
      popularBooks: [],
    };
  },
  async mounted() {
    const pageFromURL = parseInt(this.$route.query.page);
    if (!isNaN(pageFromURL) && pageFromURL >= 1) {
      this.currentPage = pageFromURL;
    }

    const genreFromURL = this.$route.query.genre;
    if (genreFromURL) {
      this.selectedGenres = [genreFromURL];
    }

    const sortFromURL = this.$route.query.sort;
    if (sortFromURL && ["popular", "new", "title"].includes(sortFromURL)) {
      this.sortOption = sortFromURL;
    }

    this.fetchGenres();

    try {
      const response = await bookService.getAllBook();
      if (Array.isArray(response)) {
        this.books = response;
      }

      await this.updateAverageRatingForBooks();

      if (userState._id) {
        const favResponse = await bookService.getFavoriteBooks(userState._id);
        this.favoriteBookIds = Array.isArray(favResponse)
          ? favResponse.map((id) => id.toString())
          : [];
      }
    } catch (error) {
      alert("Lỗi khi lấy sách!");
    }

    const popularResponse = await bookService.getPopularBookFilter();
    if (Array.isArray(popularResponse)) {
      this.popularBooks = popularResponse;
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

    async fetchGenres() {
      try {
        const response = await bookService.getAllGenre();
        this.genres = response;
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      }
    },

    goToBookDetail(bookId) {
      this.$router.push({ name: "DetailBook", params: { id: bookId } });
    },

    async toggleFavorite(book) {
      try {
        const maDocGia = userState._id;
        if (!maDocGia) {
          alert("Bạn cần đăng nhập để thêm yêu thích");
          return;
        }

        const bookId = book._id.toString();

        if (this.isFavorite(bookId)) {
          // Nếu đang là favorite -> gọi API xóa
          const data = { MaSach: bookId, MaDocGia: maDocGia };
          await bookService.deleteFavoriteBook(data);
          // cập nhật local
          this.favoriteBookIds = this.favoriteBookIds.filter(
            (id) => id.toString() !== bookId
          );
          // bạn có thể thay alert bằng toast nếu muốn
          alert("Đã bỏ yêu thích!");
        } else {
          // Nếu chưa favorite -> gọi API thêm
          const data = { MaSach: bookId, MaDocGia: maDocGia };
          await bookService.addFavoriteBook(data);
          // cập nhật local ngay
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

    getStarStyle(avg, index) {
      const avgNum = parseFloat(avg) || 0;
      const fullStars = Math.floor(avgNum);
      const decimal = avgNum - fullStars;

      if (index <= fullStars) {
        return { color: "#fa8c16" }; // sao đầy
      }

      if (index === fullStars + 1 && decimal > 0) {
        const percent = Math.round(decimal * 100);
        return {
          background: `linear-gradient(90deg, #fa8c16 ${percent}%, #ccc ${percent}%)`,
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        };
      }

      return { color: "#ccc" }; // sao rỗng
    },

    async updateAverageRatingForBooks() {
      try {
        // duyệt qua tất cả sách trong this.books
        this.books = await Promise.all(
          this.books.map(async (book) => {
            try {
              const ratings = await bookService.getRatingByBook({
                MaSach: book._id,
              });

              if (Array.isArray(ratings) && ratings.length > 0) {
                const sum = ratings.reduce((acc, r) => acc + (r.SoSao || 0), 0);
                book.averageRating = (sum / ratings.length).toFixed(1);
              } else {
                book.averageRating = 0;
              }
            } catch (error) {
              console.error("Lỗi khi tính averageRating:", error);
              book.averageRating = 0;
            }
            return book;
          })
        );
      } catch (err) {
        console.error("Lỗi khi cập nhật averageRating cho list:", err);
      }
    },
  },
  computed: {
    filteredBooks() {
      let result = this.books;

      // Filter theo search keyword
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase().trim();
        result = result.filter((book) => {
          const tenSach = book.TenSach.toLowerCase();
          const maSach = book.MaSach.toLowerCase();
          return tenSach.includes(keyword) || maSach.includes(keyword);
        });
      }

      // Filter theo thể loại đã chọn
      if (this.selectedGenres.length > 0) {
        result = result.filter((book) => {
          // Kiểm tra nếu MaTheLoai là object hoặc chuỗi
          const genreId = book.MaTheLoai?._id
            ? book.MaTheLoai._id.toString()
            : book.MaTheLoai?.toString();
          return genreId && this.selectedGenres.includes(genreId);
        });
      }

      return result;
    },

    sortedBooks() {
      if (this.sortOption === "new") {
        return [...this.filteredBooks].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (this.sortOption === "title") {
        return [...this.filteredBooks].sort((a, b) =>
          a.TenSach.localeCompare(b.TenSach, "vi", { sensitivity: "base" })
        );
      } else if (this.sortOption === "popular") {
        // Thêm case này
        // Sắp xếp theo thứ tự trong popularBooks, sau đó theo score giảm dần
        return [...this.filteredBooks].sort((a, b) => {
          const aPopular = this.popularBooks.find((p) => p._id === a._id);
          const bPopular = this.popularBooks.find((p) => p._id === b._id);

          if (aPopular && bPopular) {
            return bPopular.score - aPopular.score;
          }
          if (aPopular) return -1;
          if (bPopular) return 1;
          return 0;
        });
      } else {
        return this.filteredBooks;
      }
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

    "$route.query.genre"(newGenre) {
      if (newGenre) {
        this.selectedGenres = [newGenre];
      } else {
        this.selectedGenres = [];
      }
    },

    "$route.query.sort"(newSort) {
      if (newSort && ["popular", "new", "title"].includes(newSort)) {
        this.sortOption = newSort;
      }
    },

    sortOption() {
      this.goToPage(1);
    },

    searchKeyword() {
      this.goToPage(1);
    },

    selectedGenres() {
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