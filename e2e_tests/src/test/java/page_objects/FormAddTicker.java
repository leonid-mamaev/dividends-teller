package page_objects;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class FormAddTicker {
    String formSelector = "#form-add-ticker";

    public void setTicker(Page page, String ticker) {
        Locator input = page.locator(formSelector + " #ticker");
        input.fill(ticker);
    }

    public void setQty(Page page, String qty) {
        Locator input = page.locator(formSelector + " #qty");
        input.fill(qty);
    }

    public void submit(Page page) {
        Locator button = page.locator(formSelector + " button#submit");
        button.click();
    }
}
