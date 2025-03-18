<!-- TradingView Single Quote Widget BEGIN -->
<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f9f9f9;">
  <div class="tradingview-widget-container" style="width: 187.5px; height: 95px;">
    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js" async>
    {
      "symbol": "CFI:XAUUSD",
      "width": "100%",
      "colorTheme": "light",
      "isTransparent": false,
      "locale": "en"
    }
    </script>
  </div>
</div>
<!-- TradingView Single Quote Widget END -->

<!-- CSS للتحكم في عرض الصفحة -->
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
  }

  .tradingview-widget-container {
    width: 187.5px; /* 5 سم */
    height: 95px; /* 2.5 سم */
  }

  .tradingview-widget-container__widget {
    width: 100%;
    height: 100%;
  }
</style>
