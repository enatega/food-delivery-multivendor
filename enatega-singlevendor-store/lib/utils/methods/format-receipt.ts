const wrapAddress = (address, maxLength = 48) => {
  const words = address.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines; // returns an array
};

export const formatReceiptOld = (order) => {
  /**
   * Breaks text into lines for thermal printers.
   * - maxChars: chars per full line (48 for 80mm standard)
   * - indentSpaces: number of spaces to prefix to every line except the first
   *
   * Guarantees: every new line (except the first) begins with indentSpaces spaces.
   */
  const breakIntoLines = (
    text: string,
    maxChars = 48,
    indentSpaces = 4
  ): string => {
    if (!text) return "";

    const indent = " ".repeat(indentSpaces);
    const words = text.split(/\s+/); // split by whitespace
    const segments: string[] = []; // raw lines (without indentation)
    let current = "";
    let lineIndex = 0; // 0-based: first line is index 0

    const limitForIndex = (index: number) =>
      index === 0 ? maxChars : maxChars - indentSpaces;

    for (let w = 0; w < words.length; w++) {
      const word = words[w];

      // If current is empty, try placing word directly (maybe word itself > limit)
      let limit = limitForIndex(lineIndex);

      // If the word itself is longer than the current limit, we must split the word.
      if (word.length > limit) {
        // If there is any content in current, flush it first.
        if (current.length > 0) {
          segments.push(current.trim());
          current = "";
          lineIndex++;
          limit = limitForIndex(lineIndex);
        }

        // Now split the long word into chunks:
        // first chunk uses the current limit (could be full maxChars if this is the first line),
        // subsequent chunks use (maxChars - indentSpaces) since they will be indented.
        let start = 0;
        // first chunk uses 'limit'
        let firstChunkSize = limit;
        segments.push(word.slice(start, start + firstChunkSize));
        start += firstChunkSize;
        lineIndex++;

        const subsequentLimit = limitForIndex(lineIndex);
        while (start < word.length) {
          const chunk = word.slice(start, start + subsequentLimit);
          segments.push(chunk);
          start += subsequentLimit;
          lineIndex++;
        }

        // continue to next word
        continue;
      }

      // Try adding the word to the current line
      const candidate = current.length === 0 ? word : `${current} ${word}`;
      if (candidate.length <= limit) {
        current = candidate;
      } else {
        // flush current
        if (current.length > 0) {
          segments.push(current.trim());
          current = word; // start new line with this word
          lineIndex++;
        } else {
          // current empty but word didn't fit (shouldn't happen due to split above),
          // fallback: push the word and move on
          segments.push(word);
          lineIndex++;
          current = "";
        }
      }
    }

    if (current.length > 0) {
      segments.push(current.trim());
    }

    // Now apply indentation to every line except the first
    return segments
      .map((seg, idx) => (idx === 0 ? seg : indent + seg))
      .join("\n");
  };

  const address = order.isPickedup
    ? "PICKUP"
    : breakIntoLines(
        `${order.deliveryAddress.label || ""} ${order.deliveryAddress.details || order.deliveryAddress.deliveryAddress || ""}`.trim()
      );

  const {
    user: { email, phone },
    taxationAmount: tax,
    tipping: tip,
    paidAmount,
    orderAmount,
    deliveryCharges,
    currencySymbol,
    orderId,
    paymentMethod,
  } = order;

  const itemsText = order.items
    .map((item) => {
      const addonsText = item.addons
        .map(
          (addon) =>
            `${addon.title}: ${addon.options.map((option) => `${option.title} ${option.price}`).join(", ")}`
        )
        .join("; ");

      const variationText = item.variation?.title
        ? ` (${item.variation.title})`
        : "";

      const addonsSection = addonsText ? `\n     + ${addonsText}` : "";

      const itemPrice = item.variation.price; /*+
        item.addons
          .map((addon) =>
            addon.options.reduce((sum, option) => sum + option.price, 0)
          )
          .reduce((sum, val) => sum + val, 0); */

      return `${item.quantity}x ${String(item.title)}${variationText}   ${currencySymbol}${itemPrice.toFixed(
        2
      )}${addonsSection}`;
    })
    .join("\n");

  const text = `
                                    Date: ${new Date().toLocaleString()}
                                  
                  Order Receipt
                  -------------

    --- Customer Details -----------------------
    Customer: ${email || "-"}
    Phone: ${phone || "-"}
    Address: 
    ${address}

    --- Order Details --------------------------
    Order ID: ${orderId}
    Payment Method: ${paymentMethod}
    Order Type: ${order.isPickedup ? "Pick up" : "Delivery"}

    --- Items ----------------------------------
    ${itemsText}

    --- Surcharge ------------------------------
    Tax:           ${currencySymbol}${tax.toFixed(2)}
    Tip:           ${currencySymbol}${tip.toFixed(2)}
    Delivery ch.:  ${currencySymbol}${deliveryCharges.toFixed(2)}

    --------------------------------------------
    Total:         ${currencySymbol}${orderAmount.toFixed(2)}

    --------------------------------------------
    Thank you for your business!
`;

  return text;
};

export const formatReceipt = (order) => {
  const address = order.isPickedup
    ? "PICKUP"
    : `${order.deliveryAddress.label || ""} ${order.deliveryAddress.deliveryAddress || order.deliveryAddress.details || ""}`.trim();

  const addressLines = wrapAddress(address);

  const {
    user: { email, phone, name },
    taxationAmount: tax,
    tipping: tip,
    paidAmount,
    orderAmount,
    deliveryCharges,
    currencySymbol,
    orderId,
    paymentMethod,
    instructions,
  } = order;

  const itemsText = order.items
    .map((item) => {
      const addonsText = item.addons
        .map(
          (addon) =>
            `${addon.title}: ${addon.options.map((option) => `${option.title} [R]${currencySymbol}${option.price}`).join(", ")}`
        )
        .join("\n - ");

      const variationText = item.variation?.title
        ? ` (${item.variation.title})`
        : "";

      const addonsSection = addonsText ? `\n - ${addonsText}` : "";

      const itemPrice = item.variation.price; /*+
        item.addons
          .map((addon) =>
            addon.options.reduce((sum, option) => sum + option.price, 0)
          )
          .reduce((sum, val) => sum + val, 0); */

      return `${item.quantity}x ${String(item.title)}${variationText}   [R]${currencySymbol}${itemPrice.toFixed(
        2
      )}${addonsSection}`;
    })
    .join("\n");

  const text = `
[R]Date: ${new Date().toLocaleString()}
  
[C]*** ORDER RECEIPT ***
[C]================================

[L]--- Customer Details -----------------------
[L]Customer: ${name || email || "-"}
[L]Phone: ${phone || "-"}
[L]Address:
${addressLines.map((line) => `[L]${line}`).join("\n")}

[L]--- Order Details --------------------------
[L]Order ID: ${orderId}
[L]Payment Method: ${paymentMethod}
[L]Order Type: ${order.isPickedUp ? "Pick up" : "Delivery"}

[L]--- Items ----------------------------------
${itemsText}

[L]--- Surcharge ------------------------------
[L]Tax:           ${currencySymbol}${tax.toFixed(2)}
[L]Tip:           ${currencySymbol}${tip.toFixed(2)}
[L]Delivery ch.:  ${currencySymbol}${deliveryCharges.toFixed(2)}

${instructions ? "[L]--- Instructions ------------------------------" : ""}
${instructions ? `[L]${instructions}` : ""}

[R]--------------------------------------------
[R]<b>Total: ${currencySymbol}${orderAmount.toFixed(2)}</b>
[R]--------------------------------------------

[C]Thank you for your business!
`;

  return text;
};
