# Deer Processing Order Form — GitHub Pages Demo

This is a plain HTML/CSS/JavaScript prototype. It is designed to be easy to show, edit, and publish.

## Files
- `index.html` — page structure
- `styles.css` — visual styling
- `app.js` — form flow, conditional fields, and pricing calculations
- `assets/logo-placeholder.svg` — temporary logo artwork

## Important before taking real orders
GitHub Pages is a static website host. It does **not** receive, email, or store form submissions. This prototype currently lets a customer complete the form and print/save the final order review as a PDF, but it does not send the order to the business.

Before going live for customer orders, connect a form backend such as Formspree, Basin, or a Google Apps Script endpoint, or build a small server/API. Do not put passwords, private API keys, or database credentials in these files.

## Customize the logo
Replace `assets/logo-placeholder.svg` with the company logo. Keep the filename `logo-placeholder.svg`, or change the image path in `index.html`. The logo area appears in the page header and footer; each form step stays within the same branded page.

## Add the actual flavor lists
Open `app.js` and find the `FLAVORS` object near the top. Replace the sample flavor names with the exact flavors offered by the processor. The current flavor names are examples only and must be confirmed by the owner.

Example:
```js
summer: ["Original", "Jalapeño Cheddar", "Pepperoni"]
```
The form currently allows up to three ranked flavor preferences per specialty. The owner confirms actual weights and quantities after weighing the meat.

## Pricing behavior included
- Base processing is $95 per deer if no specialty is selected for that deer.
- Base processing is $75 per deer if at least one specialty is selected for that deer, even if standard cuts are also selected.
- Specialty product charges are calculated by actual pounds after the processor weighs the meat. Customers do not enter estimated weights.
- Summer sausage: $9/lb, 15 lb minimum per flavor.
- Snack sticks: $7/lb, 5 lb minimum per flavor.
- Sliced jerky: $6/lb, 5 lb minimum per flavor.
- Sliced jerky meat (not marinated/dehydrated): $4/lb, 5 lb minimum per flavor.
- Breakfast and Italian sausage: $6/lb; no minimum was supplied.
- Gutting $25, caping $60, European mount $120, mount board +$120.
- Extra cleaning ($15) and late pickup ($5/day after 3 days) are acknowledged but not included in the known-charge subtotal because they depend on later circumstances.

## Publish on GitHub Pages (step by step)
1. Sign in at https://github.com/ or create a free account.
2. Click the **+** button in the top-right corner and choose **New repository**.
3. Give it a name such as `deer-processing-order`.
4. Set it to **Public** if you want anyone with the link to access it. Choose **Add a README file** if GitHub offers that option.
5. Click **Create repository**.
6. In the repository, choose **Add file → Upload files**.
7. Unzip the downloaded project on your computer. Drag the files and folders inside the `deer-processing-order` folder into GitHub's upload area. Make sure `index.html` is at the top level of the repository, not inside an extra nested folder.
8. Scroll down and click **Commit changes**.
9. Open the repository's **Settings** tab.
10. In the left sidebar, choose **Pages**.
11. Under **Build and deployment**, select **Deploy from a branch**.
12. Select branch **main** and folder **/(root)**, then click **Save**.
13. Wait a minute or two. Refresh the Pages settings screen. GitHub will show the public website address, usually `https://YOUR-USERNAME.github.io/deer-processing-order/`.
14. Open that address in a new browser tab and test it on both a computer and a phone.

## Updating the website later
1. Open the repository on GitHub.
2. Click the file you want to change (for example `app.js`).
3. Click the pencil/edit icon.
4. Make the change and click **Commit changes**.
5. GitHub Pages republishes the site automatically, usually within a minute or two.

You can also replace files by using **Add file → Upload files**.

## Extra pages / future additions
This prototype uses one web page with several guided steps, so customers do not have to load a new page for every section. Later, you can add separate pages such as:
- `owner.html` — owner-only order review/weight confirmation screen (requires secure authentication and a backend; do not rely on a hidden link as security).
- `thank-you.html` — customer confirmation page after a real submission service is connected.
- `pricing.html` — public pricing information.
- `privacy.html` — privacy notice explaining how customer details are used and retained.

## Business rules to confirm before launch
- Confirm the actual flavor lists for every specialty product.
- Confirm whether gutting, caping, European mounts, and mount boards are charged per deer (this demo currently applies them per deer).
- Confirm that the $5 late pickup charge is per day and whether partial days count.
- Confirm whether the $15 extra-cleaning charge is per deer (this demo only collects acknowledgment and does not calculate it).
- Confirm how the owner wants to record actual weights, final flavor splits, and customer approval.
- Confirm whether there are any additional tag, species, or state-required fields.
