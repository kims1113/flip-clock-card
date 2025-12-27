# Flip Clock Card
## 📸 미리보기
<p align="center">
  <img width="507" height="527" alt="Image" src="https://github.com/user-attachments/assets/c395ad36-7d58-4f54-8115-cf1a3381a68f" />
</p>

## ⚙️ 설정 옵션 (Configuration)

대시보드 카드 편집기(YAML)에서 아래 옵션들을 사용하여 스타일을 자유롭게 변경할 수 있습니다.

```yaml
type: custom:flip-clock-card # 필수
font_family: "JetBrains Mono" # 구글 폰트 사용 가능 (띄어쓰기가 있다면 따옴표 필수)
font_size: 4vw                # 텍스트 크기: vw(비율) 또는 px(고정 크기)
card_width: 1                 # 카드의 가로 비율
card_height: 1.2              # 카드의 세로 비율
bg_color: "rgba(0, 0, 0, 1)"  # 카드 상단 배경 색상
bg_color_bottom: "rgba(50, 50, 50, 1)" # 카드 하단 배경 색상
text_color: "rgba(204, 204, 204, 1)"  # 텍스트 상단 색상
text_color_bottom: "rgba(255, 255, 255, 1)" # 텍스트 하단 색상
border_radius: 10             # 모서리 곡률 (0=직각, 수치가 클수록 둥근 모서리)
padding: 3%                   # 전체 패딩 (% 또는 px 단위 사용 가능)

 개별 패딩 설정 (padding대신 혹은 함께 사용가능)
 padding_top: 5%
 padding_bottom: 5%
 padding_left: 3%
 padding_right: 3%

 색상은 RGBA, HEX, Keyword, HSL, CSS Variables 모두 사용 가능합니다.
