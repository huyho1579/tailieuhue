"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DetailedDocument } from "./documentStore";

export interface PurchasedDoc {
  id: string;
  docId: string;
  title: string;
  slug: string;
  subject: string;
  driveUrl: string;
  price: number;
  pages: number;
  coverImage?: string;
  purchasedAt: string;
}

interface LibraryStoreState {
  purchasedDocs: PurchasedDoc[];
  savedDocIds: string[];
  purchaseDocument: (doc: DetailedDocument) => void;
  isPurchased: (docId: string) => boolean;
  toggleSaveDocument: (docId: string) => boolean;
  isSaved: (docId: string) => boolean;
}

export const useLibraryStore = create<LibraryStoreState>()(
  persist(
    (set, get) => ({
      purchasedDocs: [],
      savedDocIds: [],

      purchaseDocument: (doc: DetailedDocument) => {
        const { purchasedDocs } = get();
        if (purchasedDocs.some((item) => item.docId === doc.id)) {
          return; // Đã mua rồi
        }

        const newPurchased: PurchasedDoc = {
          id: `purchase-${Date.now()}`,
          docId: doc.id,
          title: doc.title,
          slug: doc.slug,
          subject: doc.subject,
          driveUrl: doc.driveUrl || "https://drive.google.com/drive/folders/edudocs-hce-tailieu",
          price: doc.price,
          pages: doc.pages,
          coverImage: doc.coverImage || doc.thumbnail,
          purchasedAt: new Date().toISOString(),
        };

        set({
          purchasedDocs: [newPurchased, ...purchasedDocs],
        });
      },

      isPurchased: (docId: string) => {
        return get().purchasedDocs.some((item) => item.docId === docId);
      },

      toggleSaveDocument: (docId: string) => {
        const { savedDocIds } = get();
        const exists = savedDocIds.includes(docId);
        if (exists) {
          set({ savedDocIds: savedDocIds.filter((id) => id !== docId) });
          return false;
        } else {
          set({ savedDocIds: [...savedDocIds, docId] });
          return true;
        }
      },

      isSaved: (docId: string) => {
        return get().savedDocIds.includes(docId);
      },
    }),
    {
      name: "edudocs-library-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
