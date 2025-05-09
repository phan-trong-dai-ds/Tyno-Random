
import type { ActualLocaleStrings as LocaleStrings } from './en'; // Use ActualLocaleStrings

export const vi: LocaleStrings = {
  // AppLayout & General
  appTitle: "Nhà Vui Ngẫu Nhiên",
  appDescription: "Bộ sưu tập các trò chơi ngẫu nhiên vui nhộn để giải trí.",
  home: "Trang chủ",
  coinFlipper: "Tung đồng xu",
  diceRoller: "Gieo xúc xắc",
  randomNumber: "Số ngẫu nhiên",
  nameWheel: "Vòng quay tên",
  viewSource: "Xem mã nguồn",
  toggleSidebar: "Chuyển đổi thanh bên",
  switchToEnglish: "Switch to English",
  switchToVietnamese: "Chuyển sang Tiếng Việt",
  navigationMenu: "Menu điều hướng",

  // HomePage
  welcomeMessage: "Chào mừng đến với",
  homePageSubtitle: "Khám phá bộ sưu tập các trò chơi ngẫu nhiên thú vị. Hoàn hảo để đưa ra quyết định, chơi cùng bạn bè, hoặc chỉ để giải trí.",
  coinFlipper_home_description: "Tung đồng xu ảo và xem vận may có mỉm cười với bạn không. Bạn sẽ được bao nhiêu mặt ngửa?",
  diceRoller_home_description: "Gieo một hoặc nhiều xúc xắc cho trò chơi của bạn hoặc chỉ để cho vui. Bạn sẽ gieo được những số nào?",
  randomNumber_home_description: "Chọn một con số bất kỳ! Xác định phạm vi của bạn và để số phận quyết định.",
  nameWheel_home_description: "Quay vòng quay để chọn ngẫu nhiên một tên hoặc một món đồ từ danh sách của bạn. Hoàn hảo cho các chương trình tặng quà!",
  playNow: "Chơi ngay",

  // Coin Flipper Page & Component
  coinFlipper_page_title: "Tung đồng xu",
  coinFlipper_page_description: "Tung một hoặc nhiều đồng xu ảo. Liệu vận may sẽ cho bạn mặt ngửa hay mặt sấp? Điều chỉnh số lượng đồng xu và xem kết quả ngẫu nhiên!",
  numCoinsLabel: "Số lượng xu (1-20)", // Updated max
  flipCoinsButton: "Tung xu",
  flippingButton: "Đang tung...",
  resultsTitle: "Kết quả",
  heads: "Ngửa",
  tails: "Sấp",
  totalHeads: "Tổng số mặt ngửa",
  totalTails: "Tổng số mặt sấp",
  numCoinsValidationAlert: "Vui lòng nhập số lượng xu từ 1 đến 20.", // Updated max

  // Dice Roller Page & Component
  diceRoller_page_title: "Gieo xúc xắc",
  diceRoller_page_description: "Gieo một hoặc nhiều xúc xắc 6 mặt tiêu chuẩn. Tuyệt vời cho các trò chơi board game, RPG, hoặc khi bạn chỉ cần một số ngẫu nhiên từ 1 đến 6.",
  numDiceLabel: "Số lượng xúc xắc (1-20)",
  rollDiceButton: "Gieo xúc xắc",
  rollingButton: "Đang gieo...",
  // resultsTitle: "Kết quả", // Re-use
  total: "Tổng cộng",
  numDiceValidationAlert: "Vui lòng nhập số lượng xúc xắc từ 1 đến 20.",

  // Random Number Page & Component
  randomNumber_page_title: "Trình tạo số ngẫu nhiên",
  randomNumber_page_description: "Cần một số ngẫu nhiên? Chỉ định giá trị tối thiểu và tối đa của bạn, và để chúng tôi chọn một số cho bạn. Đơn giản, nhanh chóng và không thiên vị.",
  minValLabel: "Giá trị nhỏ nhất",
  maxValLabel: "Giá trị lớn nhất",
  generateNumberButton: "Tạo số",
  generatingButton: "Đang tạo...",
  generatedNumberTitle: "Số đã tạo",
  minMaxValidationAlert: "Giá trị nhỏ nhất phải nhỏ hơn giá trị lớn nhất.",

  // Name Wheel Page & Component
  nameWheel_page_title: "Vòng quay tên",
  nameWheel_page_description: "Nhập danh sách tên hoặc các mục, sau đó quay vòng quay để chọn ngẫu nhiên một mục. Hoàn hảo để đưa ra lựa chọn, quà tặng, hoặc các hoạt động trong lớp học!",
  enterNamesLabel: "Nhập tên (mỗi tên một dòng)",
  shuffleNamesButtonLabel: "Trộn tên",
  sortNamesButtonLabel: "Sắp xếp tên",
  namesPlaceholder: "An\nBình\nCường...",
  namesEnteredSuffix: (count: number) => `${count} tên đã nhập.`,
  addNamesPrompt: "Thêm tên để xem vòng quay!",
  spinWheelButton: "Quay vòng quay!",
  spinningButton: "Đang quay...",
  noNamesToSpinErrorTitle: "Không có tên để quay!",
  noNamesToSpinErrorDescription: "Vui lòng thêm tên vào danh sách trước.",
  winnerAlertTitle: "Người chiến thắng!",
  removeWinnerButton: "Xóa",
  closeWinnerAlertButton: "Đóng",
  winnerRemovedToastTitle: "Đã xóa người thắng cuộc",
  winnerRemovedToastDescription: (name: string) => `${name} đã được xóa khỏi danh sách.`,
};

