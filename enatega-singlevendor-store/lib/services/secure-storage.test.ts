import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { STORE_ID } from "@/lib/utils/constants";
import { getStoreId } from "./secure-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("getStoreId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("migrates a legacy store ID into SecureStore", async () => {
    jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null);
    jest.mocked(AsyncStorage.getItem).mockResolvedValue("restaurant-1");

    await expect(getStoreId()).resolves.toBe("restaurant-1");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      STORE_ID,
      "restaurant-1",
    );
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORE_ID);
  });
});
