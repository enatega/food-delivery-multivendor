export const formatReceipt = order => {
  const address =
    order.shippingMethod === 'PICKUP'
      ? 'PICKUP'
      : `${order.deliveryAddress.label} ${order.deliveryAddress.details} ${order.deliveryAddress.deliveryAddress}`
  const {
    user: { email, phone },
    taxationAmount: tax,
    tipping: tip,
    paidAmount,
    orderAmount
  } = order
  const deliveryCharges = order.deliveryCharges
  const itemsRow = `${order.items.map(
    item => `<tr className="service">
    <td className="tableitem"><p className="itemtext">${item.title}${
      item.variation.title ? ':' + item.variation.title : ''
    },${item.addons
      .map(
        addon =>
          `<br>${addon.title}: ` +
          addon.options.map(option => option.title).join(',')
      )
      .join(',')}</p></td>
    <td className="tableitem"><p className="itemtext">${item.quantity}</p></td>
    <td className="tableitem"><p className="itemtext">${order.currencySymbol}${(
      item.variation.price +
      item.addons
        .map(addon =>
          addon.options.reduce((prev, curr) => prev + curr.price, 0)
        )
        .reduce((prev, curr) => prev + curr, 0)
    ).toFixed(2)}</p></td>
  </tr>`
  )}`
  return `<head>
  <style>
    #invoice-POS{
  margin: 0 auto;
  background: #FFF;
    }
  h1{
  font-size: 1.5em;
  color: #222;
  }
  h2{font-size: .9em;}
  h3{
  font-size: 1.2em;
  font-weight: 300;
  line-height: 2em;
  }
  p{
  font-size: .7em;
  color: #666;
  line-height: 1.2em;
  }
  #top, #mid,#bot{ /* Targets all id with 'col-' */
  border-bottom: 1px solid #EEE;
  }
  #top{min-height: 100px;}
  #mid{min-height: 80px;} 
  #bot{ min-height: 50px;}
  #top .logo{
  height: 60px;
  width: 60px;
  background: url(http://michaeltruong.ca/images/logo1.png) no-repeat;
  background-size: 60px 60px;
  }
  .clientlogo{
  float: left;
  height: 60px;
  width: 60px;
  background: url(http://michaeltruong.ca/images/client.jpg) no-repeat;
  background-size: 60px 60px;
  border-radius: 50px;
  }
  .info{
  display: block;
  margin-left: 0;
  }
  .title{
  float: right;
  }
  .title p{text-align: right;} 
  table{
  width: 100%;
  border-collapse: collapse;
  }
  .tabletitle{
  font-size: .5em;
  }
  .service{border-bottom: 1px solid #EEE;}
  .item{width: 24mm;}
  .itemtext{font-size: .5em;}
  #legalcopy{
  margin-top: 5mm;
  }
  </style>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
  />
  </head>
  <body style="text-align: center">
  <div id="invoice-POS">
    <center id="top">
      <div class="logo"></div>
      <div class="info"> 
        <h2>Enatega</h2>
      </div><!--End Info-->
    </center><!--End InvoiceTop-->
    
    <div id="mid">
      <div class="info">
        <h2>Contact Info</h2>
        <p> 
            Address : ${address}</br>
            Email   : ${email}</br>
            Phone   : ${phone}</br>
        </p>
      </div>
    </div><!--End Invoice Mid-->
    
    <div id="bot">
          <div id="table">
            <table>
              <tr class="tabletitle">
                <td class="item"><h2>Item</h2></td>
                <td class="Hours"><h2>Qty</h2></td>
                <td class="Rate"><h2>Sub Total</h2></td>
              </tr>
              ${itemsRow}
              <tr class="tabletitle">
                <td></td>
                <td class="Rate"><h2>Tax</h2></td>
                <td class="payment"><h2>${order.currencySymbol}${tax.toFixed(
    2
  )}</h2></td>
              </tr>
              <tr class="tabletitle">
                <td></td>
                <td class="Rate"><h2>Tip</h2></td>
                <td class="payment"><h2>${order.currencySymbol}${tip.toFixed(
    2
  )}</h2></td>
              </tr>
              <tr class="tabletitle">
                <td></td>
                <td class="Rate"><h2>Delivery ch.</h2></td>
                <td class="payment"><h2>${
                  order.currencySymbol
                }${deliveryCharges.toFixed(2)}</h2></td>
              </tr>
              <tr class="tabletitle">
                <td></td>
                <td class="Rate"><h2>Total</h2></td>
                <td class="payment"><h2>${
                  order.currencySymbol
                }${orderAmount.toFixed(2)}</h2></td>
              </tr>
              <tr class="tabletitle">
                <td></td>
                <td class="Rate"><h2>Paid</h2></td>
                <td class="payment"><h2>${
                  order.currencySymbol
                }${paidAmount.toFixed(2)}</h2></td>
              </tr>
            </table>
          </div><!--End Table-->
          <div id="legalcopy">
            <p class="legal"><strong>Thank you for your business!</strong> 
            </p>
          </div>
        </div><!--End InvoiceBot-->
  </div><!--End Invoice-->  
  </body>`
}
