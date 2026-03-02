import { describe, it, expect } from "vitest";
import { ruleBasedParse } from "../parser";

describe("ruleBasedParse", () => {
  describe("amount extraction", () => {
    it("parses 'k' suffix as thousands", () => {
      const result = ruleBasedParse("coffee 45k");
      expect(result.transaction?.amount).toBe(45000);
    });

    it("parses 'rb' suffix as thousands", () => {
      const result = ruleBasedParse("makan 20rb");
      expect(result.transaction?.amount).toBe(20000);
    });

    it("parses 'ribu' suffix as thousands", () => {
      const result = ruleBasedParse("parkir 5ribu");
      expect(result.transaction?.amount).toBe(5000);
    });

    it("parses 'jt' suffix as millions", () => {
      const result = ruleBasedParse("rent 2jt");
      expect(result.transaction?.amount).toBe(2000000);
    });

    it("parses 'juta' suffix as millions", () => {
      const result = ruleBasedParse("sewa 1.5juta");
      expect(result.transaction?.amount).toBe(1500000);
    });

    it("parses plain numbers", () => {
      const result = ruleBasedParse("snack 15000");
      expect(result.transaction?.amount).toBe(15000);
    });

    it("parses decimal with k", () => {
      const result = ruleBasedParse("coffee 2.5k");
      expect(result.transaction?.amount).toBe(2500);
    });
  });

  describe("pillar mapping", () => {
    it("maps food keywords to needs", () => {
      const result = ruleBasedParse("groceries 100k");
      expect(result.transaction?.pillar).toBe("needs");
    });

    it("maps transport to needs", () => {
      const result = ruleBasedParse("grab 25k");
      expect(result.transaction?.pillar).toBe("needs");
    });

    it("maps coffee to wants", () => {
      const result = ruleBasedParse("coffee 45k");
      expect(result.transaction?.pillar).toBe("wants");
    });

    it("maps shopping to wants", () => {
      const result = ruleBasedParse("shopping 200k");
      expect(result.transaction?.pillar).toBe("wants");
    });

    it("maps books to culture", () => {
      const result = ruleBasedParse("book 80k");
      expect(result.transaction?.pillar).toBe("culture");
    });

    it("maps medical to unexpected", () => {
      const result = ruleBasedParse("medical 150k");
      expect(result.transaction?.pillar).toBe("unexpected");
    });

    it("defaults to wants for unknown keywords", () => {
      const result = ruleBasedParse("random thing 50k");
      expect(result.transaction?.pillar).toBe("wants");
    });
  });

  describe("income vs expense", () => {
    it("detects salary as income", () => {
      const result = ruleBasedParse("salary 5jt");
      expect(result.transaction?.type).toBe("income");
    });

    it("detects gaji as income", () => {
      const result = ruleBasedParse("gaji 5jt");
      expect(result.transaction?.type).toBe("income");
    });

    it("defaults to expense", () => {
      const result = ruleBasedParse("coffee 45k");
      expect(result.transaction?.type).toBe("expense");
    });
  });

  describe("date parsing", () => {
    it("detects yesterday", () => {
      const result = ruleBasedParse("coffee 45k yesterday");
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(result.transaction?.date).toBe(
        yesterday.toISOString().split("T")[0]
      );
    });

    it("detects kemarin", () => {
      const result = ruleBasedParse("kopi 15k kemarin");
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(result.transaction?.date).toBe(
        yesterday.toISOString().split("T")[0]
      );
    });

    it("defaults to today", () => {
      const result = ruleBasedParse("coffee 45k");
      expect(result.transaction?.date).toBe(
        new Date().toISOString().split("T")[0]
      );
    });
  });

  describe("intent detection", () => {
    it("detects transaction intent for normal input", () => {
      const result = ruleBasedParse("coffee 45k");
      expect(result.intent).toBe("transaction");
    });

    it("detects query intent for 'total' keyword", () => {
      const result = ruleBasedParse("total expenses this month");
      expect(result.intent).toBe("query");
    });

    it("detects query intent for 'berapa' keyword", () => {
      const result = ruleBasedParse("berapa pengeluaran bulan ini");
      expect(result.intent).toBe("query");
    });

    it("detects query intent for 'how much'", () => {
      const result = ruleBasedParse("how much did I spend on wants");
      expect(result.intent).toBe("query");
    });

    it("detects query intent for 'summary'", () => {
      const result = ruleBasedParse("summary this month");
      expect(result.intent).toBe("query");
    });

    it("detects query intent for 'ringkasan'", () => {
      const result = ruleBasedParse("ringkasan bulan ini");
      expect(result.intent).toBe("query");
    });
  });

  describe("label extraction", () => {
    it("uses the input text (minus amount) as label", () => {
      const result = ruleBasedParse("bought coffee 45k");
      expect(result.transaction?.label).toBeTruthy();
      expect(result.transaction?.label).not.toContain("45k");
    });
  });
});
