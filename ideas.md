# Aurelia Jewels — Design Direction

## Selected approach: Noir atelier

The storefront will frame fine jewellery like a private evening viewing: near-black surfaces, a deep-emerald light field, warm ivory copy, and fine champagne-gold rules. A wide editorial serif will set the brand and campaign language, while a compact sans-serif will carry navigation, prices, metadata, and controls. The composition will feel deliberate rather than dense: strong negative space, offset image panels, restrained dividers, and product cards treated as curated objects rather than generic catalogue tiles.

The homepage will open with an asymmetric, full-bleed campaign composition—designed with a large text-safe field and a quiet visual focal point—and then transition into contrasting ivory collection sections. Jewellery images will sit on rich dark or pale stone-like planes with hover zooms, glints, and a subtle directional drift. Movement will remain under 300ms for direct controls and will be disabled or reduced for visitors who prefer reduced motion.

The experience will use a purposeful storefront hierarchy: collection discovery, selected pieces, craftsmanship, bespoke requests, and confidence details. Search, wishlist, cart, filtering, and selection actions will work locally in preview. Checkout-related calls will show transparent pre-integration handoff language rather than pretend to complete a payment. The admin route will be a clearly delineated operational preview, ready to be connected to a real commerce source later.

## Component vocabulary

The site will use a small, repeatable component vocabulary: the `A` monogram, gold-outline action controls, image-led product cards, oval material swatches, fine-rule section kickers, disclosure-style product detail rows, ivory content panels, and emerald status chips. This keeps pages visually coherent while allowing product, category, article, support, cart, and admin views to have distinct purposes.

## Content boundaries

All product information will be stated as catalogued sample inventory for preview purposes. Customer ratings, testimonials, review counts, and verified-purchase claims will not be displayed or fabricated. Product and operational details will explicitly remain ready for real catalog, inventory, payment, and review data once the store owner connects a commerce platform.

## Visual review notes

The desktop home, catalogue, and admin preview were reviewed after implementation. The commercial hierarchy, contrast, imagery, and admin data-state language render clearly. The product-detail desktop grid has been widened after review to preserve clear separation between the gallery and long product titles. A mobile-width check remains in the final verification pass.

The interactive product gallery was then reviewed and adjusted to constrain intrinsic image width inside its grid track. Multiple thumbnails remain available, while the product information column now keeps its own uninterrupted reading space.

The final review confirmed that the corrected gallery has four visible selection controls at desktop width, the product details remain separate from imagery, and the account route clearly communicates its MongoDB-connected handoff state.

## Next.js App Router review

The local Next.js server is rendering the expanded home page and product route at `localhost:3000`. The long-form home has a clear hero, editorial hierarchy, product discovery, trust signals, an honest review state, and a complete footer. The product route was reviewed with its multiple gallery thumbnails, media placeholders, and non-processing purchase controls; the remaining gallery zoom gesture is being enabled in the follow-up implementation step.

The completed local verification confirms the hover zoom treatment on the product gallery and a styled, validated contact enquiry layout with a non-persistent image-upload control. The home, product, and contact routes all serve from the Next.js App Router via the local development command. The hero uses an image-first cinematic treatment until the owner supplies an approved video asset, and every review component remains an honest no-content state instead of fabricated customer content.

The checkout route’s latest visual capture rendered without the expected global styling despite returning its full App Router markup and having no browser-console error. This is being checked against the local development-server output before the final local validation and handoff.

After restarting the Next.js development server from a clean cache, the checkout presentation correctly loaded its ivory-and-emerald design system. The review also confirmed the visible jewellery-protection preview checkbox and the dedicated `/order-confirmation` route. That confirmation explicitly states that no order, payment, or protection activation occurred.
