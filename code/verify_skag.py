"""Prints the live state of the freshly built SKAG, straight from the API."""

from dotenv import load_dotenv
import os
from google.ads.googleads.client import GoogleAdsClient

CAMPAIGN_ID = int(os.getenv("VERIFY_CAMPAIGN_ID", "0"))  # pass the campaign to verify

load_dotenv()
client = GoogleAdsClient.load_from_dict({
    "developer_token": os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN"),
    "client_id": os.getenv("GOOGLE_ADS_CLIENT_ID"),
    "client_secret": os.getenv("GOOGLE_ADS_CLIENT_SECRET"),
    "refresh_token": os.getenv("GOOGLE_ADS_REFRESH_TOKEN"),
    "login_customer_id": os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID") or None,
    "use_proto_plus": True,
})
ga = client.get_service("GoogleAdsService")
CID = os.getenv("GOOGLE_ADS_CUSTOMER_ID")


def q(query):
    return ga.search(customer_id=CID, query=query)


print("\n=== CAMPAIGN ===")
for r in q(f"""SELECT campaign.name, campaign.status, campaign.advertising_channel_type,
        campaign.bidding_strategy_type, campaign_budget.amount_micros,
        campaign.network_settings.target_search_network,
        campaign.network_settings.target_content_network,
        campaign.network_settings.target_partner_search_network,
        campaign.geo_target_type_setting.positive_geo_target_type
        FROM campaign WHERE campaign.id={CAMPAIGN_ID}"""):
    c = r.campaign
    print(f"  {c.name}")
    print(f"  status={c.status.name}  channel={c.advertising_channel_type.name}  "
          f"bidding={c.bidding_strategy_type.name}")
    print(f"  budget=${r.campaign_budget.amount_micros/1e6:.2f}/day  "
          f"geo_type={c.geo_target_type_setting.positive_geo_target_type.name}")
    print(f"  search_partners={c.network_settings.target_search_network}  "
          f"display={c.network_settings.target_content_network}  "
          f"partner_search={c.network_settings.target_partner_search_network}")

print("\n=== CAMPAIGN CRITERIA (counts) ===")
counts = {}
geo = sched = lang = None
for r in q(f"""SELECT campaign_criterion.type, campaign_criterion.negative,
        campaign_criterion.proximity.radius, campaign_criterion.proximity.radius_units,
        campaign_criterion.language.language_constant, campaign_criterion.ad_schedule.day_of_week
        FROM campaign_criterion WHERE campaign.id={CAMPAIGN_ID}"""):
    cc = r.campaign_criterion
    t = cc.type_.name
    counts[t] = counts.get(t, 0) + 1
    if t == "PROXIMITY":
        geo = f"{cc.proximity.radius:.0f} {cc.proximity.radius_units.name}"
    if t == "LANGUAGE":
        lang = cc.language.language_constant
for t, n in sorted(counts.items()):
    print(f"  {t}: {n}")
print(f"  -> geo radius: {geo}")
print(f"  -> language: {lang}")

print("\n=== AD GROUP + KEYWORD ===")
for r in q(f"""SELECT ad_group.name, ad_group.status FROM ad_group
        WHERE campaign.id={CAMPAIGN_ID}"""):
    print(f"  ad group: {r.ad_group.name} [{r.ad_group.status.name}]")
for r in q(f"""SELECT ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type, ad_group_criterion.status
        FROM ad_group_criterion
        WHERE campaign.id={CAMPAIGN_ID} AND ad_group_criterion.type=KEYWORD"""):
    k = r.ad_group_criterion
    print(f"  keyword: \"{k.keyword.text}\" [{k.keyword.match_type.name}] {k.status.name}")

print("\n=== RSAs ===")
for r in q(f"""SELECT ad_group_ad.ad.id, ad_group_ad.status,
        ad_group_ad.policy_summary.approval_status,
        ad_group_ad.ad.final_urls,
        ad_group_ad.ad.responsive_search_ad.headlines,
        ad_group_ad.ad.responsive_search_ad.descriptions
        FROM ad_group_ad WHERE campaign.id={CAMPAIGN_ID}"""):
    a = r.ad_group_ad
    nh = len(a.ad.responsive_search_ad.headlines)
    nd = len(a.ad.responsive_search_ad.descriptions)
    npin = sum(1 for h in a.ad.responsive_search_ad.headlines
               if h.pinned_field.name == "HEADLINE_1")
    print(f"  ad {a.ad.id} [{a.status.name}] {a.policy_summary.approval_status.name}  "
          f"{nh} headlines ({npin} pinned slot-1), {nd} descriptions  "
          f"-> {list(a.ad.final_urls)}")
