const Client = require("kubernetes-client").Client;
const Request = require("kubernetes-client/backends/request");

const certificateTemplate = require("./templates/certificate-template.json");
const ingressTemplate = require("./templates/ingress-template.json");

const k8s = require("@kubernetes/client-node");
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
var k8sAppApiClient = kc.makeApiClient(k8s.Custom_objectsApi);
var k8sExtensionsV1Beta1API = kc.makeApiClient(k8s.Extensions_v1beta1Api);

const backend = new Request(Request.config.getInCluster());
const client = new Client({ backend });
client.loadSpec();

const getPods = async () => {
  const pods = await client.api.v1.pods.get();
  let podsNames = [];
  pods.body.items.forEach(item => {
    podsNames.push(item.metadata);
    console.log("LOG] Pods: ", item.metadata);
  });
  return podsNames;
};

const getCertificates = async () => {
  let all = [];
  try {
    all = await client.apis["certmanager.k8s.io"].v1alpha1
      .namespaces("default")
      .certificates("certificate-name-nytte")
      .get();
    console.log("[LOG] Certificates: ", all);
  } catch (error) {
    console.log("[ERROR] Certificates: ", error);
  }
  return all;
};

const getCertificatesV2 = async () => {
  let all = [];
  try {
    all = await k8sAppApiClient.listClusterCustomObject(
      "certmanager.k8s.io",
      "v1alpha1",
      "certificates"
    );
    console.log("[LOG] Certificates: ", JSON.stringify(all));
  } catch (error) {
    console.log("[ERROR] Certificates: ", error);
  }
  return all;
};

const postCertificatesV2 = async () => {
  try {
    const resp = k8sAppApiClient.createNamespacedCustomObject(
      "certmanager.k8s.io",
      "v1alpha1",
      "default",
      "certificates",
      certificateTemplate
    );
    console.log("[LOG] postCertificatesV2: ", JSON.stringify(resp));
  } catch (error) {
    console.log("[ERROR] postCertificatesV2: ", error);
  }
};

// extensions/v1beta1 -- working
const getIngresses = async () => {
  let all = [];
  try {
    all = await client.apis.extensions.v1beta1
      .namespaces("default")
      .ingresses("gomesh-ingress")
      .get();
    console.log("[LOG] Ingress: ", all);
  } catch (error) {
    console.log("[ERROR] Ingress: ", error);
  }
  return all;
};

const inspectApi = async () => {
  let all = [];
  try {
    all = await client.apis;
    console.log("[LOG] inspectApi: ", all);
  } catch (error) {
    console.log("[ERROR] inspectApi: ", error);
  }
  return JSON.stringify(all);
};

const createDomain = async () => {
  let result;
  try {
    result = k8sAppApiClient.createNamespacedCustomObject(
      "certmanager.k8s.io",
      "v1alpha1",
      "default",
      "certificates",
      certificateTemplate
    );
  } catch (error) {
    console.log("[ERROR] postCertificatesV2: ", error);
  }
  return result;
};

//////////////////////////////////////////////////////////////////////////////////////////

const createIngress = async domain => {
  let result;
  try {
    const template = ingressTemplate;
    template.metadata.name = `ingress-${domain}`.replace(".", "-");
    template.spec.rules[0].host = domain;
    template.spec.tls[0].hosts[0] = domain;
    template.spec.tls[0].secretName = `secret-name-${domain}`.replace(".", "-");
    console.log("[DEBUG] createIngress: ", JSON.stringify(template));
    result = await k8sExtensionsV1Beta1API.createNamespacedIngress(
      "default",
      template
    );
    console.log("[LOG] createIngress: ", JSON.stringify(result));
  } catch (error) {
    console.log("[ERROR] createIngress: ", error);
  }

  return result;
};

const createCertificate = async domain => {
  let result;
  try {
    const template = certificateTemplate;
    template.metadata.name = `certificate-${domain}`.replace(".", "-");
    template.spec.commonName = domain;
    template.spec.dnsNames[0] = domain;
    template.spec.acme.config[0].domains[0] = domain;

    console.log("[DEBUG] createCertificate: ", JSON.stringify(template));

    result = await k8sAppApiClient.createNamespacedCustomObject(
      "certmanager.k8s.io",
      "v1alpha1",
      "default",
      "certificates",
      template
    );
    console.log("[LOG] createCertificate: ", JSON.stringify(result));
  } catch (error) {
    console.log("[ERROR] createCertificate: ", error);
  }
  return result;
};

module.exports = {
  getPods,
  getCertificates,
  getCertificatesV2,
  getIngresses,
  inspectApi,
  postCertificatesV2,
  createIngress,
  createCertificate
};
