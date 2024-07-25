package e2e_tests;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import io.cucumber.java.Before;
import io.cucumber.java.en.*;
import page_objects.PageHome;
import page_objects.PageLogin;

import java.nio.file.Paths;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class TickerStepDefinitions {
//    private final PageHome pageHome = new PageHome();
//    Page page;
//
//    @When("I set the ticker")
//    public void setTicker() {
//        pageHome.formAddTicker.setTicker(page, "AAPL");
//    }
//
//    @When("I set the quantity")
//    public void iSetQuantity() {
//        pageHome.formAddTicker.setQty(page, "1");
//    }
//
//    @When("I submit the form")
//    public void iSubmitForm() {
//        pageHome.formAddTicker.submit(page);
//    }
//
//    @Then("I should see the ticker added")
//    public void iShouldSeeTickerAdded() {
//        page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("Form.png")));
//        System.out.println("TEST");
////        assertTrue(pageHome.tableTickers.hasTicker(driver, "AAPL"));
//    }
}
