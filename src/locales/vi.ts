
import type { ActualLocaleStrings as LocaleStrings } from './en'; // Use ActualLocaleStrings

export const vi: LocaleStrings = {
  // AppLayout & General
  appTitle: "Tyno Random",
  appDescription: "Bộ sưu tập các trò chơi ngẫu nhiên vui nhộn để giải trí.",
  home: "Trang chủ",
  coinFlipper: "Tung đồng xu",
  diceRoller: "Gieo xúc xắc",
  randomNumber: "Số ngẫu nhiên",
  nameWheel: "Vòng quay tên",
  rockPaperScissors: "Oẳn Tù Tì",
  blindBox: "Xé túi mù", // Changed from "Mở hộp mù"
  viewSource: "Xem mã nguồn",
  toggleSidebar: "Chuyển đổi thanh bên",
  switchToEnglish: "Switch to English",
  switchToVietnamese: "Chuyển sang Tiếng Việt",
  navigationMenu: "Menu điều hướng",
  toggleTheme: "Chuyển đổi giao diện",
  switchToDarkMode: "Chuyển sang giao diện tối",
  switchToLightMode: "Chuyển sang giao diện sáng",

  // HomePage
  welcomeMessage: "Chào mừng đến với",
  homePageSubtitle: "Khám phá bộ sưu tập các trò chơi ngẫu nhiên thú vị. Hoàn hảo để đưa ra quyết định, chơi cùng bạn bè, hoặc chỉ để giải trí.",
  coinFlipper_home_description: "Tung đồng xu ảo và xem vận may có mỉm cười với bạn không. Bạn sẽ được bao nhiêu mặt ngửa?",
  diceRoller_home_description: "Gieo một hoặc nhiều xúc xắc cho trò chơi của bạn hoặc chỉ để cho vui. Bạn sẽ gieo được những số nào?",
  randomNumber_home_description: "Chọn một con số bất kỳ! Xác định phạm vi của bạn và để số phận quyết định.",
  nameWheel_home_description: "Quay vòng quay để chọn ngẫu nhiên một tên hoặc một món đồ từ danh sách của bạn. Hoàn hảo cho các chương trình tặng quà!",
  rockPaperScissors_home_description: "Trò chơi lựa chọn cổ điển. Búa, Bao, hay Kéo - ai sẽ giành chiến thắng?",
  blindBox_home_description: "Chọn một điều bất ngờ! Nhập các món đồ và rút ngẫu nhiên một món từ trong túi. Bạn sẽ nhận được gì?", // Changed "hộp" to "túi"
  playNow: "Chơi ngay",

  // Coin Flipper Page & Component
  coinFlipper_page_title: "Tung đồng xu",
  coinFlipper_page_description: "Tung một hoặc nhiều đồng xu ảo. Liệu vận may sẽ cho bạn mặt ngửa hay mặt sấp? Điều chỉnh số lượng đồng xu và xem kết quả ngẫu nhiên!",
  numCoinsLabel: "Số lượng xu (1-20)",
  flipCoinsButton: "Tung xu",
  flippingButton: "Đang tung...",
  resultsTitle: "Kết quả",
  heads: "Ngửa",
  tails: "Sấp",
  totalHeads: "Tổng số mặt ngửa",
  totalTails: "Tổng số mặt sấp",
  numCoinsValidationAlert: "Vui lòng nhập số lượng xu từ 1 đến 20.",

  // Dice Roller Page & Component
  diceRoller_page_title: "Gieo xúc xắc",
  diceRoller_page_description: "Gieo một hoặc nhiều xúc xắc 6 mặt tiêu chuẩn. Tuyệt vời cho các trò chơi board game, RPG, hoặc khi bạn chỉ cần một số ngẫu nhiên từ 1 đến 6.",
  numDiceLabel: "Số lượng xúc xắc (1-20)",
  rollDiceButton: "Gieo xúc xắc",
  rollingButton: "Đang gieo...",
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

  // Rock Paper Scissors Page & Component
  rockPaperScissors_page_title: "Oẳn Tù Tì",
  rockPaperScissors_page_description: "Chơi Oẳn Tù Tì. Lựa chọn của mỗi người chơi là ngẫu nhiên. Ai sẽ thắng vòng này?",
  player1: "Người chơi 1",
  player2: "Người chơi 2",
  chooseButtonPlayer: (player: string) => `${player}: Ra chiêu!`,
  chosenButton: "Đã ra chiêu",
  choosingButton: "Đang chọn...",
  rock: "Búa",
  paper: "Bao",
  scissors: "Kéo",
  player1Wins: "Người chơi 1 thắng!",
  player2Wins: "Người chơi 2 thắng!",
  draw: "Hòa!",
  playAgainButton: "Chơi lại",
  waitingForPlayer: (player: string) => `Đang chờ ${player}...`,
  makeYourChoice: "Hãy ra chiêu!",
  beatsText: "thắng",

  // Blind Box Page & Component (Now "Xé túi mù" in Vietnamese)
  blindBox_page_title: "Xé túi mù", // Changed from "Mở hộp mù"
  blindBox_page_description: "Giống như trò rút thăm may mắn! Thêm các vật phẩm vào túi và xem bạn rút được gì. Bất ngờ nào đang chờ đợi?", // Changed "hộp" to "túi"
  enterItemsLabel: "Nhập vật phẩm (mỗi vật phẩm một dòng)",
  shuffleItemsButtonLabel: "Trộn vật phẩm",
  sortItemsButtonLabel: "Sắp xếp vật phẩm",
  itemsPlaceholder: "Kẹo\nĐồ chơi\nPhiếu giảm giá...",
  itemsEnteredSuffix: (count: number) => `${count} vật phẩm đã nhập.`,
  addItemsPrompt: "Thêm vật phẩm vào túi!", // Changed "hộp" to "túi"
  openBoxButton: "Xé túi", // Changed from "Mở hộp"
  openingBoxButton: "Đang xé...", // Changed from "Đang mở..."
  noItemsToOpenErrorTitle: "Không có gì trong túi!", // Changed "hộp" to "túi"
  noItemsToOpenErrorDescription: "Vui lòng thêm vật phẩm vào túi trước.", // Changed "hộp" to "túi"
  itemDrawnAlertTitle: "Bạn đã rút được:",
  removeItemButton: "Xóa vật phẩm",
  itemRemovedToastTitle: "Vật phẩm đã được xóa",
  itemRemovedToastDescription: (name: string) => `${name} đã được xóa khỏi túi.`, // Changed "hộp" to "túi"
};

    