<template>
  <div class="borrow-book">
    <div class="borrow-book__util">
      <div class="borrow-book__util-search">
        <div class="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            class="search-input"
            v-model="searchKeyword"
          />
          <button class="search-button-management-borrow">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <input type="date" class="search-date ml-2" v-model="selectedDate" />
      </div>

      <div class="borrow-book__util-all-status">
        <select class="status-select" v-model="selectedStatus">
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="borrow-book__tabs">
      <div
        class="borrow-book__tab"
        :class="{ active: currentTab === 'require' }"
        @click="currentTab = 'require'"
      >
        Danh Sách Yêu Cầu Mượn
      </div>

      <div
        class="borrow-book__tab"
        :class="{ active: currentTab === 'borrowed' }"
        @click="currentTab = 'borrowed'"
      >
        Danh Sách Đã Mượn
      </div>

      <div
        class="borrow-book__tab"
        :class="{ active: currentTab === 'punish' }"
        @click="currentTab = 'punish'"
      >
        Danh Sách Xử Phạt
      </div>
    </div>

    <table
      class="borrow-book__list-require-borrow mt-4 table w-100"
      v-if="currentTab === 'require'"
    >
      <thead>
        <tr>
          <th class="borrow-book__list-require-borrow-title">Mã Độc Giả</th>
          <th class="borrow-book__list-require-borrow-title">Độc Giả</th>
          <th class="borrow-book__list-require-borrow-title">Sách</th>
          <th class="borrow-book__list-require-borrow-title">Số Cuốn</th>
          <th class="borrow-book__list-require-borrow-title">Ngày Yêu Cầu</th>
          <th class="borrow-book__list-require-borrow-title">Trạng thái</th>
          <th class="borrow-book__list-require-borrow-title">Xử Lý</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedTrackBorrowList"
          :key="item._id"
          @click="handleRowClick(item)"
        >
          <td class="borrow-book__list-require-borrow-content">
            {{ item.MaDocGia?.MaDocGia }}
          </td>
          <td
            class="borrow-book__list-require-borrow-content borrow-book__list-require-borrow-content-author"
          >
            {{ item.MaDocGia?.HoLot }} {{ item.MaDocGia?.Ten }}
          </td>
          <td
            class="borrow-book__list-require-borrow-content borrow-book__list-require-borrow-content-title-book"
          >
            {{ item.MaSach?.TenSach }}
          </td>
          <td class="borrow-book__list-require-borrow-content">
            <span class="borrow-book__list-require-borrow-content-quantity">
              {{ item.SoLuong }}</span
            >
          </td>
          <td class="borrow-book__list-require-borrow-content">
            {{ new Date(item.createdAt).toLocaleDateString("vi-VN") }}
          </td>
          <td class="borrow-book__list-require-borrow-content">
            <div
              class="borrow-book__list-require-borrow-status"
              :class="{
                'borrow-book__list-require-borrow-status-waiting':
                  item.TrangThai === 'pending',
                'borrow-book__list-require-borrow-status-approved':
                  item.TrangThai === 'approved',
                'borrow-book__list-require-borrow-status-denied':
                  item.TrangThai === 'denied',
              }"
            >
              {{
                item.TrangThai === "pending"
                  ? "Chờ Duyệt"
                  : item.TrangThai === "approved"
                  ? "Đã Duyệt"
                  : "Đã Từ Chối"
              }}
            </div>
          </td>
          <td class="borrow-book__list-require-borrow-content">
            <template v-if="item.TrangThai === 'pending'">
              <button
                type="button"
                class="borrow-book__list-require-borrow-btn-accept borrow-book__list-require-borrow-status"
                @click.stop="approveRequest(item._id)"
              >
                Duyệt
              </button>
              <button
                type="button"
                class="borrow-book__list-require-borrow-deny borrow-book__list-require-borrow-status"
                @click.stop="denyRequest(item._id)"
              >
                Từ chối
              </button>
            </template>
            <template v-else>
              <div
                class="borrow-book__list-require-borrow-btn-done borrow-book__list-require-borrow-status"
              >
                Đã xử lý
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="book__library-list-book-navigation-page"
      v-if="currentTab === 'require' && paginatedTrackBorrowList.length > 0"
    >
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(1)">«</a>
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
          <a class="page-link" href="#" @click.prevent>{{ currentPage }}</a>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPage(currentPage + 1)"
            >›</a
          >
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(totalPages)"
            >»</a
          >
        </li>
      </ul>
    </div>

    <table
      class="borrow-book__list-borrowed mt-4 table w-100"
      v-if="currentTab === 'borrowed'"
    >
      <thead>
        <tr>
          <th class="borrow-book__list-borrowed-title">Mã Độc Giả</th>
          <th class="borrow-book__list-borrowed-title">Độc Giả</th>
          <th class="borrow-book__list-borrowed-title">Sách</th>
          <th class="borrow-book__list-borrowed-title">Số cuốn</th>
          <th class="borrow-book__list-borrowed-title">Ngày Mượn</th>
          <th class="borrow-book__list-borrowed-title">Hạn Trả</th>
          <th class="borrow-book__list-borrowed-title">Ngày Trả</th>
          <th class="borrow-book__list-borrowed-title">Tình Trạng</th>
          <th class="borrow-book__list-borrowed-title">Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedBorrowedList"
          :key="item._id"
          @click="handleRowClick(item)"
        >
          <td class="borrow-book__list-borrowed-content">
            {{ item.MaDocGia?.MaDocGia }}
          </td>

          <td
            class="borrow-book__list-borrowed-content borrow-book__list-borrowed-content-author"
          >
            {{ item.MaDocGia?.HoLot }} {{ item.MaDocGia?.Ten }}
          </td>

          <td
            class="borrow-book__list-borrowed-content borrow-book__list-borrowed-content-title-book"
          >
            {{ item.MaSach?.TenSach }}
          </td>

          <td class="borrow-book__list-borrowed-content">
            <span class="borrow-book__list-borrowed-content-quantity">
              {{ item.SoLuong }}</span
            >
          </td>

          <td class="borrow-book__list-borrowed-content">
            {{ new Date(item.NgayMuon).toLocaleDateString("vi-VN") }}
          </td>

          <td class="borrow-book__list-borrowed-content">
            {{ new Date(item.NgayTra).toLocaleDateString("vi-VN") }}
          </td>

          <td class="borrow-book__list-borrowed-content">
            {{
              item.NgayGhiNhanTra
                ? new Date(item.NgayGhiNhanTra).toLocaleDateString("vi-VN")
                : "Chưa trả"
            }}
          </td>

          <td class="borrow-book__list-borrowed-content">
            <div
              class="borrow-book__list-require-borrow-status"
              :class="{
                'borrow-book__list-borrowed-status-borrowing':
                  item.TrangThai === 'approved',
                'borrow-book__list-borrowed-status-overdue':
                  item.TrangThai === 'overdue',
                'borrow-book__list-borrowed-status-returned':
                  item.TrangThai === 'returned' &&
                  new Date(item.NgayGhiNhanTra) <= new Date(item.NgayTra),
                'borrow-book__list-borrowed-status-late':
                  item.TrangThai === 'returned' &&
                  new Date(item.NgayGhiNhanTra) > new Date(item.NgayTra),
              }"
            >
              {{
                item.TrangThai === "approved"
                  ? "Đang Mượn"
                  : item.TrangThai === "overdue"
                  ? "Quá Hạn"
                  : new Date(item.NgayGhiNhanTra) > new Date(item.NgayTra)
                  ? "Trả Trễ"
                  : "Đã Trả"
              }}
            </div>
          </td>

          <td class="borrow-book__list-borrowed-content">
            <template
              v-if="
                item.TrangThai === 'approved' || item.TrangThai === 'overdue'
              "
            >
              <button
                type="button"
                class="borrow-book__list-borrowed-btn-return borrow-book__list-require-borrow-status"
                @click.stop="openReturnStatusModal(item)"
              >
                Đã trả
              </button>
              <button
                type="button"
                class="borrow-book__list-borrowed-btn-extend borrow-book__list-require-borrow-status"
                @click.stop="handleExtendBorrow(item)"
              >
                Gia hạn
              </button>
            </template>
            <template v-else>
              <div
                class="borrow-book__list-borrowed-btn-completed borrow-book__list-require-borrow-status"
              >
                Hoàn thành
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="book__library-list-book-navigation-page"
      v-if="currentTab === 'borrowed' && paginatedBorrowedList.length > 0"
    >
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPageBorrowed === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPageBorrowed(1)"
            >«</a
          >
        </li>

        <li class="page-item" :class="{ disabled: currentPageBorrowed === 1 }">
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPageBorrowed(currentPageBorrowed - 1)"
            >‹</a
          >
        </li>

        <li class="page-item active">
          <a class="page-link" href="#" @click.prevent>{{
            currentPageBorrowed
          }}</a>
        </li>

        <li
          class="page-item"
          :class="{ disabled: currentPageBorrowed === totalPagesBorrowed }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPageBorrowed(currentPageBorrowed + 1)"
            >›</a
          >
        </li>

        <li
          class="page-item"
          :class="{ disabled: currentPageBorrowed === totalPagesBorrowed }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPageBorrowed(totalPagesBorrowed)"
            >»</a
          >
        </li>
      </ul>
    </div>

    <transition name="modal-fade">
      <div
        class="modal"
        v-if="showModal"
        tabindex="-1"
        @click="showModal = false"
      >
        <div class="modal-dialog" @click.stop>
          <!-- ✅ Thêm @click.stop để tránh đóng khi click vào nội dung -->
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{
                  currentTab === "require"
                    ? "Chi tiết yêu cầu mượn sách"
                    : currentTab === "borrowed"
                    ? "Chi tiết mượn sách"
                    : "Chi tiết xử phạt"
                }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="showModal = false"
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="modal-body-request-book">
                <div class="modal-body-request-book-image">
                  <img :src="selectedItem?.MaSach?.Image" alt="" />
                </div>

                <div class="modal-body-request-book-information">
                  <p>
                    <strong>Mã độc giả:</strong>
                    {{ selectedItem?.MaDocGia?.MaDocGia }}
                  </p>

                  <p>
                    <strong>Họ tên:</strong> {{ selectedItem?.MaDocGia?.HoLot }}
                    {{ selectedItem?.MaDocGia?.Ten }}
                  </p>

                  <p>
                    <strong>Mã Sách:</strong> {{ selectedItem?.MaSach?.MaSach }}
                  </p>

                  <p>
                    <strong>Sách:</strong> {{ selectedItem?.MaSach?.TenSach }}
                  </p>

                  <p><strong>Số cuốn:</strong> {{ selectedItem?.SoLuong }}</p>

                  <!-- Hiển thị thông tin khác nhau tùy theo tab -->
                  <div v-show="currentTab === 'require'">
                    <p>
                      <strong>Ngày yêu cầu:</strong>
                      {{
                        selectedItem?.createdAt
                          ? new Date(selectedItem.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""
                      }}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>
                      {{
                        selectedItem?.TrangThai === "pending"
                          ? "Chờ Duyệt"
                          : selectedItem?.TrangThai === "approved"
                          ? "Đã Duyệt"
                          : "Đã Từ Chối"
                      }}
                    </p>
                  </div>

                  <div v-show="currentTab === 'borrowed'">
                    <p>
                      <strong>Ngày mượn:</strong>
                      {{
                        selectedItem?.NgayMuon
                          ? new Date(selectedItem.NgayMuon).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""
                      }}
                    </p>

                    <p>
                      <strong>Hạn trả:</strong>
                      {{
                        selectedItem?.NgayTra
                          ? new Date(selectedItem.NgayTra).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""
                      }}
                    </p>

                    <p>
                      <strong>Ngày trả:</strong>
                      {{
                        selectedItem?.NgayGhiNhanTra
                          ? new Date(
                              selectedItem.NgayGhiNhanTra
                            ).toLocaleDateString("vi-VN")
                          : "Chưa trả"
                      }}
                    </p>

                    <p>
                      <strong>Tình trạng:</strong>
                      {{
                        selectedItem?.TrangThai === "approved"
                          ? "Đang Mượn"
                          : selectedItem?.TrangThai === "overdue"
                          ? "Quá Hạn"
                          : new Date(selectedItem?.NgayGhiNhanTra) >
                            new Date(selectedItem?.NgayTra)
                          ? "Trả Trễ"
                          : "Đã Trả"
                      }}
                    </p>
                  </div>

                  <div v-show="currentTab === 'punish'">
                    <p>
                      <strong>Hạn trả:</strong>
                      {{
                        selectedItem?.NgayTra
                          ? new Date(selectedItem.NgayTra).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""
                      }}
                    </p>

                    <p>
                      <strong>Ngày trả:</strong>
                      {{
                        selectedItem?.NgayGhiNhanTra
                          ? new Date(
                              selectedItem.NgayGhiNhanTra
                            ).toLocaleDateString("vi-VN")
                          : "--"
                      }}
                    </p>

                    <p>
                      <strong>Tình trạng sách:</strong>
                      {{ selectedItem?.TinhTrangSach || "Chưa rõ" }}
                    </p>

                    <p>
                      <strong>Phí quá hạn:</strong>
                      <span style="color: #ff6b6b">
                        {{ (selectedItem?.PhiQuaHan || 0).toLocaleString() }}đ
                      </span>
                    </p>

                    <p>
                      <strong>Phí bồi thường:</strong>
                      <span style="color: #ff6b6b">
                        {{
                          (selectedItem?.PhiBoiThuong || 0).toLocaleString()
                        }}đ
                      </span>
                    </p>

                    <p>
                      <strong>Tổng tiền phạt:</strong>
                      <span
                        style="color: red; font-weight: bold; font-size: 18px"
                      >
                        {{
                          (
                            (selectedItem?.PhiQuaHan || 0) +
                            (selectedItem?.PhiBoiThuong || 0)
                          ).toLocaleString()
                        }}đ
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <table
      class="borrow-book__list-penalty mt-4 table w-100"
      v-if="currentTab === 'punish'"
    >
      <thead>
        <tr>
          <th class="borrow-book__list-penalty-title">Mã Độc Giả</th>
          <th class="borrow-book__list-penalty-title">Độc Giả</th>
          <th class="borrow-book__list-penalty-title">Sách</th>
          <th class="borrow-book__list-penalty-title">Hạn Trả</th>
          <th class="borrow-book__list-penalty-title">Ngày Trả</th>
          <th class="borrow-book__list-penalty-title">Tình Trạng</th>
          <th class="borrow-book__list-penalty-title">Phí Quá Hạn</th>
          <th class="borrow-book__list-penalty-title">Phí Bồi Thường</th>
          <th class="borrow-book__list-penalty-title">Tổng Tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedPunishList"
          :key="item._id"
          @click="handleRowClick(item)"
        >
          <td class="borrow-book__list-penalty-content">
            {{ item.MaDocGia?.MaDocGia }}
          </td>
          <td class="borrow-book__list-penalty-content">
            {{ item.MaDocGia?.HoLot }} {{ item.MaDocGia?.Ten }}
          </td>
          <td class="borrow-book__list-penalty-content">
            {{ item.MaSach?.TenSach }}
          </td>
          <td class="borrow-book__list-penalty-content">
            {{ new Date(item.NgayTra).toLocaleDateString("vi-VN") }}
          </td>
          <td class="borrow-book__list-penalty-content">
            {{
              item.NgayGhiNhanTra
                ? new Date(item.NgayGhiNhanTra).toLocaleDateString("vi-VN")
                : "--"
            }}
          </td>
          <td class="borrow-book__list-penalty-content">
            {{ item.TinhTrangSach || "Chưa rõ" }}
          </td>
          <td class="borrow-book__list-penalty-content">
            {{ (item.PhiQuaHan || 0).toLocaleString() }}đ
          </td>
          <td class="borrow-book__list-penalty-content">
            {{ (item.PhiBoiThuong || 0).toLocaleString() }}đ
          </td>
          <td class="borrow-book__list-penalty-content">
            {{
              (
                (item.PhiQuaHan || 0) + (item.PhiBoiThuong || 0)
              ).toLocaleString()
            }}đ
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="book__library-list-book-navigation-page"
      v-if="currentTab === 'punish' && paginatedPunishList.length > 0"
    >
      <ul class="pagination">
        <!-- Về trang đầu -->
        <li class="page-item" :class="{ disabled: currentPagePunish === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPagePunish(1)">«</a>
        </li>

        <!-- Lùi 1 trang -->
        <li class="page-item" :class="{ disabled: currentPagePunish === 1 }">
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPagePunish(currentPagePunish - 1)"
            >‹</a
          >
        </li>

        <!-- Trang hiện tại -->
        <li class="page-item active">
          <a class="page-link" href="#" @click.prevent>
            {{ currentPagePunish }}
          </a>
        </li>

        <!-- Tiến 1 trang -->
        <li
          class="page-item"
          :class="{ disabled: currentPagePunish === totalPagesPunish }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPagePunish(currentPagePunish + 1)"
            >›</a
          >
        </li>

        <!-- Về trang cuối -->
        <li
          class="page-item"
          :class="{ disabled: currentPagePunish === totalPagesPunish }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="goToPagePunish(totalPagesPunish)"
            >»</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import "../assets/css/managementBorrowBook.css";

import { bookService } from "../services/book/book.service";
import { userState } from "../assets/js/userState";

export default {
  name: "ManagementBorrowBook",
  data() {
    return {
      currentTab: "require",
      trackBorrowList: [],
      selectedStatus: "all",
      searchKeyword: "",
      selectedDate: "",
      selectedRow: null,
      selectedItem: null, // ✅ Đổi từ selectedRow thành selectedItem
      showModal: false, // ✅ Đổi từ selectedRow thành selectedItem
      currentPage: 1,
      pageSize: 6,
      currentPageBorrowed: 1,
      showReturnStatusModal: false,
      returnStatusOptions: ["Nguyên vẹn", "Hư sách", "Mất sách"],
      selectedReturnStatus: "",
      currentReturnItem: null,
      currentPagePunish: 1,
    };
  },

  watch: {
    currentTab() {
      this.currentPage = 1;
      this.currentPageBorrowed = 1;
      this.currentPagePunish = 1;
      this.selectedStatus = "all";
      this.selectedDate = "";
    },
    searchKeyword() {
      if (this.currentTab === "require") this.currentPage = 1;
      else if (this.currentTab === "borrowed") this.currentPageBorrowed = 1;
      else if (this.currentTab === "punish") this.currentPagePunish = 1;
    },
    selectedStatus() {
      if (this.currentTab === "require") this.currentPage = 1;
      else if (this.currentTab === "borrowed") this.currentPageBorrowed = 1;
      else if (this.currentTab === "punish") this.currentPagePunish = 1;
    },
    selectedDate() {
      if (this.currentTab === "require") this.currentPage = 1;
      else if (this.currentTab === "borrowed") this.currentPageBorrowed = 1;
      else if (this.currentTab === "punish") this.currentPagePunish = 1;
    },
  },

  mounted() {
    this.fetchTrackBorrowList();
  },

  methods: {
    async fetchTrackBorrowList() {
      try {
        const response = await bookService.getTrackBorrowBook();
        const result = [];

        for (const item of response || []) {
          const updatedItem = await this.updateOverdueIfNeeded(item);
          result.push(updatedItem);
        }

        this.trackBorrowList = result;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách mượn:", error);
      }
    },

    async approveRequest(id) {
      try {
        await bookService.updateBorrowStatus({
          requestId: id,
          adminId: userState._id,
          status: "approved",
        });
        this.fetchTrackBorrowList();
      } catch (err) {
        console.error("Lỗi duyệt yêu cầu:", err);
      }
    },

    async denyRequest(id) {
      try {
        await bookService.updateBorrowStatus({
          requestId: id,
          adminId: userState._id,
          status: "denied",
        });
        this.fetchTrackBorrowList();
      } catch (err) {
        console.error("Lỗi từ chối yêu cầu:", err);
      }
    },

    async updateOverdueIfNeeded(item) {
      const now = new Date();
      const NgayTra = new Date(item.NgayTra);

      if (item.TrangThai === "approved" && NgayTra < now) {
        try {
          await bookService.updateBorrowStatus({
            requestId: item._id,
            adminId: userState._id,
            status: "overdue",
          });
          item.TrangThai = "overdue"; // Cập nhật local để hiển thị đúng
        } catch (err) {
          console.error(`Lỗi cập nhật quá hạn cho ${item._id}:`, err);
        }
      }

      return item;
    },

    async handleExtendBorrow(item) {
      const GIA_HAN_THEM_NGAY = 3;

      // Kiểm tra nếu đã gia hạn rồi
      const ngayMuon = new Date(item.NgayMuon);
      const NgayTra = new Date(item.NgayTra);
      const soNgay = Math.floor((NgayTra - ngayMuon) / (1000 * 60 * 60 * 24));

      if (soNgay > 7) {
        alert("Bạn chỉ được gia hạn 1 lần!");
        return;
      }

      const confirmExtend = confirm(
        `Bạn có chắc muốn gia hạn thêm ${GIA_HAN_THEM_NGAY} ngày không?`
      );
      if (!confirmExtend) return;

      try {
        const newDueDate = new Date(item.NgayTra);
        newDueDate.setDate(newDueDate.getDate() + GIA_HAN_THEM_NGAY);

        // Gửi API gọi backend (chưa làm ở bước này, bạn sẽ xử lý sau)
        await bookService.extendBorrowTime({
          requestId: item._id,
          adminId: userState._id,
          newDueDate: newDueDate.toISOString(),
        });

        alert(`Đã gia hạn đến ngày ${newDueDate.toLocaleDateString("vi-VN")}`);
        this.fetchTrackBorrowList(); // Load lại danh sách mượn
      } catch (error) {
        console.error("Gia hạn thất bại:", error);
        alert("Gia hạn thất bại. Vui lòng thử lại sau.");
      }
    },

    formatDateToYMD(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    handleRowClick(item) {
      this.selectedItem = item; // ✅ Sử dụng selectedItem thay vì selectedRow
      this.showModal = true; // ✅ Sử dụng showModal thay vì showDetailModal
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    goToPageBorrowed(page) {
      if (page >= 1 && page <= this.totalPagesBorrowed) {
        this.currentPageBorrowed = page;
      }
    },

    openReturnStatusModal(item) {
      this.currentReturnItem = item; // ✅ lưu item đang thao tác
      this.selectedReturnStatus = ""; // reset lựa chọn
      this.showReturnStatusModal = true; // mở modal
    },

    async markAsReturned(id) {
      try {
        await bookService.updateBorrowStatus({
          requestId: id,
          adminId: userState._id,
          status: "returned",
        });
        this.fetchTrackBorrowList(); // Refresh lại danh sách
      } catch (err) {
        console.error("Lỗi đánh dấu đã trả:", err);
      }
    },

    async confirmReturnStatus() {
      if (!this.selectedReturnStatus) return;

      try {
        await bookService.updateReturnStatus({
          requestId: this.currentReturnItem._id,
          adminId: userState._id,
          status: "returned",
          bookCondition: this.selectedReturnStatus, // ✅ gửi trạng thái trả sách
        });

        this.showReturnStatusModal = false;
        this.fetchTrackBorrowList(); // ✅ refresh danh sách
        alert(`Đã trả sách với trạng thái: ${this.selectedReturnStatus}`);
      } catch (err) {
        console.error("Lỗi khi cập nhật trạng thái trả:", err);
        alert("Cập nhật thất bại, vui lòng thử lại.");
      }
    },

    goToPagePunish(page) {
      if (page >= 1 && page <= this.totalPagesPunish) {
        this.currentPagePunish = page;
      }
    },
  },

  computed: {
    filteredTrackBorrowList() {
      return this.trackBorrowList.filter((item) => {
        const keyword = this.searchKeyword.toLowerCase().trim();
        const status = this.selectedStatus;
        const selectedDate = this.selectedDate;

        // ✅ Xử lý riêng cho tab xử phạt
        if (this.currentTab === "punish") {
          // Chỉ lấy những dòng có phí
          if (!(item.PhiBoiThuong > 0 || item.PhiQuaHan > 0)) return false;

          // ✅ Lọc theo trạng thái sách nếu không phải "all"
          if (status !== "all" && item.TinhTrangSach !== status) return false;

          // ✅ Lọc theo keyword nếu có nhập
          if (keyword) {
            const hoTen = `${item.MaDocGia?.HoLot || ""} ${
              item.MaDocGia?.Ten || ""
            }`.toLowerCase();
            const maDocGia = item.MaDocGia?.MaDocGia?.toLowerCase() || "";
            const tenSach = item.MaSach?.TenSach?.toLowerCase() || "";

            const matched =
              hoTen.includes(keyword) ||
              maDocGia.includes(keyword) ||
              tenSach.includes(keyword);

            if (!matched) return false;
          }

          // ✅ Lọc theo ngày nếu có chọn (sử dụng NgayTra)
          if (selectedDate) {
            const targetDate = new Date(item.NgayTra);
            const formattedTarget = this.formatDateToYMD(targetDate);
            if (formattedTarget !== selectedDate) return false;
          }

          return true; // ✅ Tab punish: đã qua hết các điều kiện lọc
        }

        // ✅ Xử lý cho 2 tab cũ (require và borrowed)
        const validStatusList =
          this.currentTab === "require"
            ? ["pending", "approved", "denied"]
            : ["approved", "overdue", "returned"];

        if (!validStatusList.includes(item.TrangThai)) return false;

        // ✅ Lọc theo trạng thái nếu không phải "all"
        if (status !== "all" && item.TrangThai !== status) return false;

        // ✅ Lọc theo keyword nếu có nhập
        if (keyword) {
          const hoTen = `${item.MaDocGia?.HoLot || ""} ${
            item.MaDocGia?.Ten || ""
          }`.toLowerCase();
          const maDocGia = item.MaDocGia?.MaDocGia?.toLowerCase() || "";
          const tenSach = item.MaSach?.TenSach?.toLowerCase() || "";

          const matched =
            hoTen.includes(keyword) ||
            maDocGia.includes(keyword) ||
            tenSach.includes(keyword);

          if (!matched) return false;
        }

        // ✅ Lọc theo ngày nếu có chọn
        if (selectedDate) {
          const targetDate =
            this.currentTab === "require"
              ? new Date(item.createdAt)
              : new Date(item.NgayMuon);

          const formattedTarget = this.formatDateToYMD(targetDate);
          if (formattedTarget !== selectedDate) return false;
        }

        return true; // ✅ Các tab khác: đã qua hết các điều kiện lọc
      });
    },

    paginatedTrackBorrowList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTrackBorrowList.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredTrackBorrowList.length / this.pageSize);
    },

    paginatedBorrowedList() {
      if (this.currentTab !== "borrowed") return [];

      const start = (this.currentPageBorrowed - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTrackBorrowList.slice(start, end);
    },

    // total pages for borrowed tab
    totalPagesBorrowed() {
      if (this.currentTab !== "borrowed") return 1;
      return Math.max(
        1,
        Math.ceil(this.filteredTrackBorrowList.length / this.pageSize)
      );
    },

    statusOptions() {
      if (this.currentTab === "require") {
        return [
          { value: "all", text: "Tất cả trạng thái" },
          { value: "pending", text: "Chờ duyệt" },
          { value: "approved", text: "Đã duyệt" },
          { value: "denied", text: "Từ chối" },
        ];
      } else if (this.currentTab === "borrowed") {
        return [
          { value: "all", text: "Tất cả trạng thái" },
          { value: "approved", text: "Đang Mượn" },
          { value: "overdue", text: "Quá Hạn" },
          { value: "returned", text: "Đã Trả" },
        ];
      } else if (this.currentTab === "punish") {
        return [
          { value: "all", text: "Tất cả trạng thái" },
          { value: "Mất sách", text: "Mất Sách" },
          { value: "Hư sách", text: "Hư Sách" },
        ];
      }
      return [];
    },

    paginatedPunishList() {
      if (this.currentTab !== "punish") return [];
      const start = (this.currentPagePunish - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTrackBorrowList.slice(start, end);
    },

    totalPagesPunish() {
      if (this.currentTab !== "punish") return 1;
      return Math.max(
        1,
        Math.ceil(this.filteredTrackBorrowList.length / this.pageSize)
      );
    },
  },
};
</script>

