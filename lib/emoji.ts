// Notion callout ikonunun emoji olup olmadığına site renderer'ı ve editör aynı
// kuralla karar versin; yoksa 🇹🇷, 👍🏽 gibi ikonlar editörde gövdeye kayıyor.
export const emojiOnlyPattern =
  /^(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Extended_Pictographic}|\p{Emoji_Component}|️|‍)+$/u;
