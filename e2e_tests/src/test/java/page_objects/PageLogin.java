package page_objects;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import java.nio.file.Paths;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PageLogin {

//    public void visit(Page page) {
//        String url = "http://localhost:3000/login";
//        page.navigate(url);
//        page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("login.png")));
//    }

    public void login(Page page, String email, String password) {
        setEmail(page, email);
        setPassword(page, password);
        submit(page);
    }

    public void setEmail(Page page, String value) {
        Locator input = page.locator("#email");
        input.fill(value);
    }

    public void setPassword(Page page, String value) {
        Locator input = page.locator("#password");
        input.fill(value);
    }

    public void submit(Page page) {
        Locator button = page.locator("#submit");
        button.click();
        Locator loading = page.locator("#loading");
        assertThat(loading).isHidden();
    }
}
