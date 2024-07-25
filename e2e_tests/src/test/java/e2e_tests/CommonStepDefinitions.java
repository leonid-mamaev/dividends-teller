package e2e_tests;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import page_objects.PageHome;
import page_objects.PageLogin;

import java.nio.file.Paths;


public class CommonStepDefinitions {
//    private final PageHome pageHome = new PageHome();
    Page page;

    @Before
    public void initialization() {
        Playwright playwright = Playwright.create();
        BrowserType.LaunchOptions options = new BrowserType.LaunchOptions();
        options.setChannel("chrome").setHeadless(false).setSlowMo(50);
        Browser browser = playwright.chromium().launch(options);
        page = browser.newPage();
    }

    @Given("I visit {} page")
    public void iVisit(String pageName) {
        String url = "http://localhost:3000/" + pageName;
        page.navigate(url);
        System.out.println("test");
    }

    @Given("I see {}")
    public void iVisitTest() {
    }
}
